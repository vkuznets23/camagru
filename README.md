> **_NOTE:_** This project is actively being developed. Some features may not be fully functional, and UI/UX improvements are ongoing.

# Camagru
Camagru is a modern social media web application that allows users to share, interact, and engage with photos in a secure and fun way. It’s designed to provide a smooth and responsive user experience across all devices. Users can easily capture moments using their webcam or upload images, interact with others via likes and comments, and manage their own profiles.

[you can try it here!](https://camagru-tau.vercel.app/)

[live demo video](https://github.com/user-attachments/assets/f1107567-b6fc-494c-9c03-4073f10b18a9)

## 🛠 Technologies

1. **Backend and frontend:** Next.js + TypeScript
2. **Database:** Prisma + MySQL via supabase
3. **Tests:** Jest + Playwright


## 🚀 Key Features
### 🔐 Authentication
The application implements a secure and production-style authentication system:
- **Password Security**: All passwords hashed with bcrypt (12 salt rounds)
- **Email Verification**: Required before account activation
- **Session Management**: JWT-based sessions via NextAuth.js
- **Client-side session checks** to redirect unauthenticated users
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, number, and symbol
<img width="1437" height="747" alt="image" src="https://github.com/user-attachments/assets/2c4a4340-e029-48eb-845b-0222dd924ecc" />

### 👤 User Profile
![Screen Recording 2026-02-18 at 18 41 48](https://github.com/user-attachments/assets/b32494ef-f441-4e95-991d-20ef54429923)


### 📷 Post Modal
Provides advanced post management and social interactions:

- Like, unlike, and bookmark posts with optimistic UI updates
- Inline caption editing (available only to post owner) with smart truncation and validation
- Secure post deletion with cascade removal of all associated likes and comments
![Screen Recording 2026-02-18 at 18 40 27](https://github.com/user-attachments/assets/522b832b-8474-430f-944d-80a8a93f90d0)


### Post Creation System
Users can create and publish posts with built-in validation, media processing, and interactive UI enhancements.

- Live image preview before publishing  
- Auto-resizing caption textarea  
- Caption validation (length limit + sanitization)  
- Disabled publish button until all validations pass  
- Image filters  

<table>
  <tr>
<td width="50%" valign="top">
<img src="https://github.com/user-attachments/assets/2270666d-65dc-4115-beaa-5017c7e92963" width="100%" />
  </td>

<td width="50%" align="center">
<img src="https://github.com/user-attachments/assets/15ab7bd7-4569-445e-8abd-4ba9658befca" width="100%" />
  </td>
</tr>
</table>

### 🔎 Search bar with search history
![Screen Recording 2026-02-18 at 18 48 13](https://github.com/user-attachments/assets/a9bbc50c-864e-46e0-925b-02c45f22bd36)


### 🌛 Dark mode
![Screen Recording 2026-02-18 at 18 38 07](https://github.com/user-attachments/assets/5b18de41-bcc9-4d47-beaf-28be8f0af592)



### 📦 Installation
1. Clone this git repository:

``` bash
https://github.com/vkuznets23/camagru
cd camagruApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
``` bash
# Create a .env file

DATABASE_URL="postgresql://USERNAME@localhost:****/db_name"
AUTH_SECRET="SECRET"
NEXTAUTH_URL="http://localhost:****"

EMAIL_SERVER_HOST="sandbox.smtp.mailtrap.io"
EMAIL_SERVER_PORT=****
EMAIL_SERVER_USER="SERVER_USER"
EMAIL_SERVER_PASSWORD="SERVER_PASSWORD" 
EMAIL_FROM="noreply@yourdomain.com"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME='CLOUD_NAME'
NEXT_PUBLIC_CLOUDINARY_UPLOADPRESET='CLOUDINARY_UPLOADPRESET'
CLOUDINARY_API_KEY='API_KEY'
CLOUDINARY_API_SECRET='API_SECRET'
```

4. Run the development server:
```bash
npm run dev
```




