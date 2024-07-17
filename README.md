# Make Real Starter

This project is a powerful tool that allows you to transform hand-drawn wireframes into functional HTML prototypes using AI. It's built with Next.js, tldraw, and integrates with OpenRouter's AI models.

## Features

- Draw wireframes on an infinite canvas
- Convert drawings to interactive HTML prototypes with a single click
- Real-time preview of generated prototypes
- Ability to iterate and refine designs
- Support for custom prompts to guide the AI
- Responsive design support

## Use Cases

1. Rapid prototyping for web designers and developers
2. Brainstorming sessions for product teams
3. Teaching UI/UX design concepts
4. Quick visualization of ideas for client presentations
5. Exploring design variations efficiently

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- An OpenRouter API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/make-real-starter.git
   cd make-real-starter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```
npm run build
```

### Deployment

This project is set up to deploy on Cloudflare Pages. Follow these steps:

1. Push your code to a GitHub repository.

2. Log in to your Cloudflare account and go to the Pages section.

3. Create a new project and connect it to your GitHub repository.

4. In the build settings:
   - Set the build command to: `npm run pages:build`
   - Set the build output directory to: `.vercel/output/static`

5. Add your environment variables (OPENROUTER_API_KEY) in the Cloudflare Pages settings.

6. Deploy your site.

For subsequent deployments, you can use:

```
npm run deploy
```

This will build your project and deploy it to Cloudflare Pages.

## How It Works

1. Users draw wireframes on the tldraw canvas.
2. When the "Make Real" button is clicked, the selected drawings are converted to an image.
3. This image, along with any text content and custom prompts, is sent to the OpenRouter AI model.
4. The AI generates HTML based on the input.
5. The generated HTML is displayed in an interactive iframe on the canvas.
6. Users can iterate on the design by annotating the result and generating again.

## Customization

- Modify the `app/prompt.ts` file to change the instructions sent to the AI.
- Update the `PreviewShape` component in `app/PreviewShape/PreviewShape.tsx` to change how the generated content is displayed.
- Adjust the styling in `app/globals.css` to match your preferred design.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [tldraw](https://www.tldraw.com/) for the amazing drawing library
- [OpenRouter](https://openrouter.ai/) for providing access to powerful AI models
- [Next.js](https://nextjs.org/) for the React framework
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting and deployment
