# Try Scalekit


This project demonstrates how to use Scalekit's connect platform to connect with Gmail.

**Learn more about Scalekit:** [docs.scalekit.com](https://docs.scalekit.com)

## Environment Setup

Before running the project, you'll need Scalekit credentials:

1. **Copy the example environment file**
   ```bash
   cp api/example.env api/.env
   ```

2. **Fill in your Scalekit credentials** in `api/.env`
   - `SCALEKIT_CLIENT_ID` - Your client ID
   - `SCALEKIT_CLIENT_SECRET` - Your client secret  
   - `SCALEKIT_ENV_URL` - Your environment URL

**Get your credentials:** Sign up at [scalekit.com](https://scalekit.com) and create a new project to obtain these values.

## Quick Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   - Copy and configure `/api/.env` with your Scalekit credentials (see Environment Setup above)

3. **Run the project**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://127.0.0.1:5328](http://127.0.0.1:5328)

## Learn More

- **[Scalekit Documentation](https://docs.scalekit.com/)** - Complete integration platform guide
- **[Scalekit Platform](https://scalekit.com)** - Sign up and get started