> **_NOTE:_** This project is actively being developed. Some features may not be fully functional, and UI/UX improvements are ongoing.

## Camagru
Camagru is a modern social media web application that allows users to share, interact, and engage with photos in a secure and fun way. It’s designed to provide a smooth and responsive user experience across all devices. Users can easily capture moments using their webcam or upload images, interact with others via likes and comments, and manage their own profiles.

### 🚀 Description
Key highlights include:

* **User-friendly interface:** Intuitive design for quick navigation and interaction.
* **Interactive social features:** Like, comment, and bookmark posts seamlessly.
* **Profile and content management:** Users can upload photos or take webcam shots, use simple photot filters, edit posts, update profiles, and share content via QR codes.
* **Real-time user search:** Quickly find and follow other users.
* **Customizable experience:** Dark mode for comfortable browsing at any time.
* **Secure and reliable:** Email-verified authentication ensures user safety.


### 🛠 Technologies

**Backend and frontend:** Next.js + TypeScript

**Database:** Prisma + MySQL via supabase

**Tests:** Jest + Playwright


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




