# Rate Limiting & Caching - Quick Reference

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Completes Survey                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           Response Created (ID: 65abc123...)                 │
│           User Redirected to Results Page                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SurveyResult Component Loads                    │
│         Check Cache: GET /api/response/ID/ai-cache           │
└──────────────┬────────────────────────┬─────────────────────┘
               │                        │
        Cache Found?              Cache Not Found
               │                        │
               ▼                        ▼
    ┌─────────────────────┐  ┌─────────────────────────┐
    │  Load Instantly! ✅  │  │  Generate with AI 🤖    │
    │  - No API calls      │  │  1. Check rate limit    │
    │  - Free!             │  │  2. Call OpenAI         │
    │  - Fast!             │  │  3. Save to cache       │
    └─────────────────────┘  └───────────┬─────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────┐
                           │    Rate Limit Check      │
                           └──────┬──────────┬────────┘
                                  │          │
                           Allowed?     Rate Limited
                                  │          │
                                  ▼          ▼
                    ┌─────────────────┐  ┌─────────────────┐
                    │  Generate AI ✅  │  │  Show Error ❌   │
                    │  Increment count │  │  "Try in 45min" │
                    │  Return content  │  └─────────────────┘
                    └─────────────────┘
```

---

## 🔑 Key Components

### Rate Limiting
```
┌────────────────────────────────────────┐
│         Rate Limit Record              │
├────────────────────────────────────────┤
│ Identifier: IP + Response ID           │
│ Endpoint: /api/openai/avatar           │
│ Count: 2/3                             │
│ Window: 10:00 AM - 11:00 AM           │
│ Auto-expires: 11:00 AM                │
└────────────────────────────────────────┘
```

### Caching
```
┌────────────────────────────────────────┐
│      Cached AI Content                 │
├────────────────────────────────────────┤
│ Avatar:                                │
│  • Image URL                           │
│  • Name: "Glamorous Tiger"            │
│  • Generated: 10:15 AM                │
│                                        │
│ Custom Content: [...]                  │
│  • Component ID                        │
│  • Title                               │
│  • AI-generated text                   │
└────────────────────────────────────────┘
```

---

## 📋 Quick Commands

### Check Rate Limit Status
```javascript
// In your code
import { getRateLimitStatus } from '@/libs/rateLimit';

const status = await getRateLimitStatus(req, '/api/openai/avatar', responseId);
console.log(status);
// {
//   remaining: 1,
//   total: 3,
//   reset: Date,
//   exceeded: false
// }
```

### Manually Clear Rate Limit (MongoDB)
```javascript
// In MongoDB shell or Compass
db.ratelimits.deleteMany({ identifier: "IP_192.168.1.1_RESPONSE_65abc123" })
```

### View All Rate Limits (MongoDB)
```javascript
db.ratelimits.find({}).sort({ createdAt: -1 })
```

### Clear Cache for Response
```javascript
db.responses.updateOne(
  { _id: ObjectId("65abc123...") },
  { $unset: { aiGeneratedContent: "" } }
)
```

---

## 🎯 Testing Checklist

### Rate Limiting Tests
- [ ] Complete survey
- [ ] Refresh result page 3 times (should work)
- [ ] Refresh 4th time (should fail with 429)
- [ ] Wait 1 hour, refresh (should work again)
- [ ] Check error message is user-friendly
- [ ] Verify MongoDB rate limit record created

### Caching Tests
- [ ] Complete survey (first time)
- [ ] Wait for AI generation
- [ ] Note the content
- [ ] Refresh page
- [ ] Content should be identical
- [ ] Should load instantly (< 1 second)
- [ ] Check browser Network tab (no OpenAI calls)
- [ ] Verify MongoDB cache saved in Response document

### Error Handling Tests
- [ ] Trigger rate limit
- [ ] Verify error message displays
- [ ] Check "Retry After" time is shown
- [ ] Verify rate limit headers in response
- [ ] Test with different IP addresses
- [ ] Test with missing responseId

---

## 🐛 Troubleshooting

### Issue: Rate limit not working
**Solution:** Check MongoDB connection and RateLimit collection exists

### Issue: Cache not loading
**Solution:** Check Response document has `aiGeneratedContent` field

### Issue: "Cannot read property of undefined"
**Solution:** Ensure `responseId` is passed from PublicSurvey → SurveyResult

### Issue: Rate limit resets too quickly
**Solution:** Check `windowMs` in `libs/rateLimit.js` (should be 3600000 for 1 hour)

### Issue: Users bypassing with VPN
**Solution:** Consider adding browser fingerprinting or user authentication

---

## 📊 Monitoring

### Check Total API Usage (MongoDB)
```javascript
// Count rate limit records
db.ratelimits.countDocuments({ apiEndpoint: "/api/openai/avatar" })

// Group by endpoint
db.ratelimits.aggregate([
  { $group: { _id: "$apiEndpoint", count: { $sum: "$requestCount" } } }
])
```

### Check Cache Hit Rate
```javascript
// Count responses with cache
db.responses.countDocuments({ "aiGeneratedContent.avatar.imageUrl": { $exists: true } })

// Total responses
db.responses.countDocuments({})
```

---

## 🔒 Security Notes

- Rate limits are per IP + Response combo (isolated)
- No user data stored in rate limit records
- Automatic cleanup after expiration
- Cache is private (only accessible via response ID)
- HTTPS recommended in production

---

## 💡 Pro Tips

1. **Adjust limits easily:** Just change values in `libs/rateLimit.js`
2. **Monitor costs:** Check MongoDB `ratelimits` collection for usage
3. **Cache analytics:** Query `responses` for cache hit rate
4. **Clean up old records:** MongoDB TTL handles automatically
5. **Scale up:** Switch to Redis when you need distributed rate limiting

---

**Need help?** Check `IMPLEMENTATION_RATE_LIMITING.md` for full details!
