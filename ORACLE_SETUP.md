# Oracle AI Setup

## API Key Configuration

The Oracle AI feature uses the Groq API. Your API key should be configured in the `.env` file:

```
VITE_GROQ_API_KEY=your_api_key_here
```

Get your free API key at: https://console.groq.com

## Important: Restart Required

**After updating the `.env` file, you MUST restart the development server for the changes to take effect.**

### How to Restart:

1. Stop the current dev server (Ctrl+C or Cmd+C)
2. Run `npm run dev` again
3. The Oracle should now work with the new API key

### Troubleshooting:

If Oracle still doesn't work after restarting:

1. Check that the API key is valid at https://console.groq.com
2. Make sure there are no extra spaces or characters in the `.env` file
3. Verify the `.env` file is in the root directory (same level as `package.json`)
4. Check browser console for any error messages
5. Try clearing browser cache and reloading

### Testing:

1. Navigate to the Oracle page
2. Select a domain
3. Type a question and press Enter
4. You should see a response from the AI

If you see an error message about missing API key, the `.env` file is not being read correctly - make sure to restart the dev server!
