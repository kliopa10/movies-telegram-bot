const { base64encode, base64decode } = require('../utils/base64')

function _decryptFilePath(x) {
    const encryptKey = 'FGeRtNzK'

    let a = x.substr(2)

    // HD Rezka decoder
    const bks = ["$$#!!@#!@##", "^^^!@##!!##", "####^!!##!@@",  "@@@@@!##!^^^", "$$!!@$$@^!@#$$@"]

    bks.forEach(bk => {
        a = a.replace('//_//'+base64encode(bk), '')
    })

    return Buffer.from(a, 'base64').toString()
}

const r = _decryptFilePath('#hWzM2MHBdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzUvMC80LzQvNi82L2U4YjE0YTU2OTBiMGU3OWVkN2ZkOTc5MjQwMzlhMDRkOjIwMjIwNjIxMTg6WnpaSFoybEZjR0YxWm5sUlJWQjVPRVJVWTJsV05ERkxhRWR5ZVVSTE16Vk5UbVJoV1U1b1JtSXdPVkpvV2paUVpERjZXVFZ6VVZCeFNIRlZWbnBPWlhsUFlUQlFjMVI1UlhKbmNEQnNiV1Z4ZVRrcmEzYzlQUT09LzI0azAyLm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvODkxYTIxYmI0NDU1OTI4ZGZlNmY2Y2VjMTk3OTE1MjY6MjAyMjA2MjExODpaelpIWjJsRmNHRjFabmxSUlZCNU9FUlVZMmxXTkRGTGFFZHllVVJMTXpWTlRtUmhXVTVvUm1Jd09WSm9XalpRWkRGNldUVnpVVkJ4U0hGVlZucE9aWGxQWVRCUWMxUjVSWEpuY0RCc2JXVnhlVGtyYTNjOVBRPT0vNS8wLzQvNC82LzYvMjRrMDIubXA0LFs0ODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy81LzAvNC80LzYvNi9lOGIxNGE1NjkwYjBlNzllZDdmZDk3OTI0MDM5YTA0ZDoyMDIyMDYyMTE4Olp6WkhaMmxGY0dGMVpubFJSVkI1T0VSVVkybFdOREZMYUVkeWVVUkxNelZOVG1SaFdVNW9SbUl3T1ZKb1dqWlFaREY2V1RWelVWQnhTSEZWVm5wT1pYbFBZVEJRYzFSNVJYSm5jREJzYldWeGVUa3JhM2M5UFE9PS82aTJtdC5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzAxNjc0YjdlY2JlNDM3MDYyZmVmNDIyZDdkNDliNjI1OjIwMjIwNjIxMTg6WnpaSFoybEZjR0YxWm5sUlJWQjVPRVJVWTJsV05ERkxhRWR5ZVVSTE16Vk5UbVJoV1U1b1JtSXdPVkpvV2paUVpERjZXVFZ6VVZCeFNIRlZWbnBPWlhsUFlUQlFjMVI1UlhKbmNEQnNiV1Z4ZVRrcmEzYzlQUT09LzUvMC80LzQvNi82LzZpMm10Lm1wNCxbNzIwcF1odH//_//JCQhIUAkJEBeIUAjJCRARwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNS8wLzQvNC82LzYvZThiMTRhNTY5MGIwZTc5ZWQ3ZmQ5NzkyNDAzOWEwNGQ6MjAyMjA2MjExODpaelpIWjJsRmNHRjFabmxSUlZCNU9FUlVZMmxXTkRGTGFFZHllVVJMTXpWTlRtUmhXVTVvUm1Jd09WSm9XalpRWkRGNldUVnpVVkJ4U0hGVlZucE9aWGxQWVRCUWMxUjVSWEpuY0RCc2JXVnhlVGtyYTNjOVBRPT0venN3M2cubXA0OmhsczptYW5pZmVzdC5tM3U4IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy82YTliYTVkNTE0OWUwYjUyODQ1MmNmMDQ5YzEwMTU2NDoyMDIyMDYyMTE4Olp6WkhaMmxGY0dGMVpubFJSVkI1T0VSVVkybFdOREZMYUVkeWVVUkxNelZOVG1SaFdVNW9SbUl3T1ZKb1dqWlFaREY2V1RWelVWQnhTSEZWVm5wT1pYbFBZVEJRYzFSNVJYSm5jREJzYldWeGVUa3JhM2M5UFE9PS81LzAvNC80LzYvNi96c3czZy5tcDQsWzEwODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy81LzAvNC80LzYvNi9lOGIxNGE1NjkwYjBlNzllZDdmZDk3OTI0MDM5YTA0ZDoyMDIyMDYyMTE4Olp6WkhaMmxGY0dGMVpubFJSVkI1T0VSVVkybFdOREZMYUVkeWVVUkxNelZOVG1SaFdVNW9SbUl3T1ZKb1dqWlFaREY2V1RWelVWQnhTSEZWVm5wT1pYbFBZVEJRYzFSNVJYSm5jREJzYldWeGVUa3JhM2M5UFE9PS8zaTF//_//Xl5eIUAjIyEhIyM=yMi5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzViNDg0NTUwZDk4NTM5ZDA2ZDM0ZDdjYWE1NzJjOGIzOjIwMjIwNjIxMTg6WnpaSFoybEZjR0YxWm5sUlJWQjVPRVJVWTJsV05ERkxhRWR5ZVVSTE16Vk5UbVJoV1U1b1JtSXdPVkpvV2paUVpERjZXVFZ6VVZCeFNIRlZWbnBPWlhsUFlUQlFjMVI1UlhKbmNEQnNiV1Z4ZVRrcmEzYzlQUT09LzUvMC80LzQvNi82LzNpMXIyLm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9zdHJlYW0//_//QEBAQEAhIyMhXl5eudm9pZGJvb3N0LmNjLzUvMC80LzQvNi82L2U4YjE0YTU2OTBiMGU3OWVkN2ZkOTc5MjQwMzlhMDRkOjIwMjIwNjIxMTg6WnpaSFoy//_//JCQjISFAIyFAIyM=bEZjR0YxWm5sUlJWQjVPRVJVWTJsV05ERkxhRWR5ZVVSTE16Vk5UbVJoV1U1b1JtSXdPVkpvV2paUVpERjZXVFZ6VVZCeFNIRlZWbnBPWlhsUFlUQlFjMVI1UlhKbmNEQnNiV1Z4ZVRrcmEzYzlQUT09LzNpMXIyLm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNWI0ODQ1NTBkOTg1MzlkMDZkMzRkN2NhYTU3MmM4YjM6MjAyMjA2MjExODpaelpIWjJsRmNHRjFabmxSUlZCNU9FUlVZMmxXTkRGTGFFZHllVVJMTXpWTlRtUmhXVTVvUm1Jd09WSm9XalpRWkRGNldUVnpVVkJ4U0hGVlZucE9aWGxQWVRCUWMxUjVSWEpuY0RCc2J//_//IyMjI14hISMjIUBAXVnhlVGtyYTNjOVBRPT0vNS8wLzQvNC82LzYvM2kxcjIubXA0')
console.log(r)