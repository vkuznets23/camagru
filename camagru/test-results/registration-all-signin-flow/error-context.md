# Page snapshot

```yaml
- main:
  - img "camagru logo"
  - paragraph: Sign in to see photos and videos from your friends
  - textbox: username
  - textbox "Show password": ValidPass123!
  - button "Show password":
    - img
  - paragraph: Invalid login or password
  - button "Sign In"
  - link "Forgotten your password?":
    - /url: /auth/forgot-password
  - paragraph:
    - text: Dont have an account?
    - link "Sign up":
      - /url: /auth/register
- alert
- button "Open Next.js Dev Tools":
  - img
```