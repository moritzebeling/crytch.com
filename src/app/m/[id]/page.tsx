"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { DrawingCanvas, useCanvasFunctions } from "@/components/canvas";
import { Button, Menu, MenuItem, ThemeProvider, useTheme } from "@/components/ui";
import { Corner } from "@/components/layout";
import { useTranslation, type Language } from "@/lib/i18n";
import type { Message } from "@/types";

function MessageViewer() {
  const params = useParams();
  const id = params.id as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFns = useCanvasFunctions(canvasRef);
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { setBackground, setColor, setStrokeWidth } = useTheme();

  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Load message
  useEffect(() => {
    async function loadMessage() {
      try {
        const response = await fetch(`/api/messages/${id}`);
        const data = await response.json();

        if (data.status === "success") {
          setMessage(data.data);
          // Apply saved styles
          if (data.data.styleBackground) setBackground(data.data.styleBackground);
          if (data.data.styleColor) setColor(data.data.styleColor);
          if (data.data.styleStroke) setStrokeWidth(data.data.styleStroke);
        } else {
          setError(data.error || t("tools.decrypt.messageNotFound"));
        }
      } catch {
        setError(t("tools.decrypt.messageNotFound"));
      } finally {
        setIsLoading(false);
      }
    }

    loadMessage();
  }, [id, t, setBackground, setColor, setStrokeWidth]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length > 0) {
      canvasFns.decrypt(newPassword);
      setIsDecrypted(true);
    }
  }, [canvasFns]);

  const handleReply = useCallback(() => {
    window.location.href = "/";
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">{error}</p>
            <Button onClick={handleReply}>{t("general.startNew")}</Button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <DrawingCanvas
        initialMessage={message?.message}
        readOnly={true}
        version={message?.version as 1 | 2 || 2}
      />

      {/* Top Left - Info */}
      <Corner position="tl">
        <Menu trigger={<Button>{t("general.more")}</Button>} position="tl">
          <MenuItem>
            <a href="/about" className="block hover:underline">{t("general.more")}</a>
          </MenuItem>
          <MenuItem noBorder>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.read") }} />
          </MenuItem>
        </Menu>
      </Corner>

      {/* Top Right - Reply */}
      <Corner position="tr">
        <Button onClick={handleReply}>{t("general.reply")}</Button>
      </Corner>

      {/* Bottom Left - Settings */}
      <Corner position="bl">
        <Menu trigger={<Button>{t("settings.title")}</Button>} position="bl">
          <MenuItem noBorder>
            <div className="flex items-center justify-between">
              <span>{t("settings.language")}</span>
              <div className="flex gap-1">
                {availableLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant={language === lang ? "active" : "grey"}
                    onClick={() => setLanguage(lang as Language)}
                    className="px-2"
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </MenuItem>
        </Menu>
      </Corner>

      {/* Bottom Right - Decrypt */}
      <Corner position="br">
        <Menu trigger={<Button variant={isDecrypted ? "active" : "default"}>{t("tools.decrypt.title")}</Button>} position="br">
          <MenuItem noBorder>
            <div className="mb-2">
              <label className="block mb-1 text-xs">{t("tools.decrypt.enterPassword")}</label>
              <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                className="w-full"
                placeholder={t("general.password")}
                autoComplete="off"
              />
            </div>
          </MenuItem>
        </Menu>
      </Corner>
    </div>
  );
}

export default function MessagePage() {
  return (
    <ThemeProvider>
      <MessageViewer />
    </ThemeProvider>
  );
}
