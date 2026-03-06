import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Bebas_Neue } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Desbrava Total — Plataforma de Gestão para Clubes",
  description:
    "A plataforma definitiva para gestão de Clubes de Desbravadores. IA integrada, classes, especialidades e muito mais.",
  icons: {
    icon: [{ url: "/favicon.jpg" }, { url: "/icon.jpg", type: "image/jpeg" }],
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* UTMify Script */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          strategy="afterInteractive"
        />

        {/* Pixel Script */}
        <Script id="pixel-setup" strategy="afterInteractive">
          {`
            window.pixelId = "69aa40215e32f07f1fc58d60";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>

        {/* Back Redirect Script */}
        <Script id="back-redirect" strategy="afterInteractive">
          {`
            const link = 'https://meubackredirect.com.br';

            function setBackRedirect(url) {
              let urlBackRedirect = url;
              urlBackRedirect = urlBackRedirect.trim() +
                (urlBackRedirect.indexOf('?') > 0 ? '&' : '?') +
                document.location.search.replace('?', '').toString();

              history.pushState({}, '', location.href);
              history.pushState({}, '', location.href);
              history.pushState({}, '', location.href);

              window.addEventListener('popstate', () => {
                console.log('onpopstate', urlBackRedirect);
                setTimeout(() => {
                  location.href = urlBackRedirect;
                }, 1);
              });
            }

            setBackRedirect(link);
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
