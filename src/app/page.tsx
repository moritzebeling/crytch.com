"use client";

import { useRef, useState, useCallback } from "react";
import { DrawingCanvas, useCanvasFunctions } from "@/components/canvas";
import { Button, Menu, MenuItem, Modal, ModalContent, ModalActions, ModalAction, ThemeProvider, useTheme } from "@/components/ui";
import { Corner } from "@/components/layout";
import { useTranslation, type Language } from "@/lib/i18n";
import type { ToolType } from "@/types";

function DrawingTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFns = useCanvasFunctions(canvasRef);
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { background, setBackground, color, setColor, strokeWidth, setStrokeWidth, isDark } = useTheme();

  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const [canvasFilled, setCanvasFilled] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToolChange = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    canvasFns.setTool(tool);
  }, [canvasFns]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length > 0 && canvasFilled) {
      canvasFns.restore();
      canvasFns.encrypt(newPassword);
    } else if (newPassword.length === 0 && isEncrypted) {
      canvasFns.restore();
    }
  }, [canvasFilled, isEncrypted, canvasFns]);

  const handleSave = useCallback(async () => {
    if (!canvasFilled || isSaving) return;

    setIsSaving(true);
    try {
      const messageJson = canvasFns.exportJSON();

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageJson,
          gridSize: 15,
          gridWidth: Math.floor(window.innerWidth / 15),
          gridHeight: Math.floor(window.innerHeight / 15),
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          styleColor: color,
          styleBackground: background,
          styleStroke: strokeWidth,
          language,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSavedUrl(window.location.origin + data.url);
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  }, [canvasFilled, canvasFns, color, background, strokeWidth, language, isSaving]);

  const handleClear = useCallback(() => {
    canvasFns.clear();
    setPassword("");
    setSavedUrl(null);
    setShowClearModal(false);
  }, [canvasFns]);

  const handleCopyUrl = useCallback(() => {
    if (savedUrl) {
      navigator.clipboard.writeText(savedUrl);
    }
  }, [savedUrl]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <DrawingCanvas
        onCanvasChange={setCanvasFilled}
        onEncryptedChange={setIsEncrypted}
      />

      {/* Top Left - About/Help Menus */}
      <Corner position="tl">
        <Menu
          trigger={<Button variant={showHelpMenu ? "active" : "default"}>{t("general.more")}</Button>}
          position="tl"
        >
          <MenuItem>
            <a href="/about" className="block hover:underline">{t("general.more")}</a>
          </MenuItem>
          <MenuItem>
            <a href="/blog" className="block hover:underline">Blog</a>
          </MenuItem>
          <MenuItem noBorder>
            <a 
              href={`mailto:hello@crytch.com?subject=${encodeURIComponent(t("general.emailDefaultSubject"))}`}
              className="block hover:underline"
            >
              {t("general.emailLink")}
            </a>
          </MenuItem>
        </Menu>

        <Menu
          trigger={<Button onClick={() => setShowHelpMenu(!showHelpMenu)}>?</Button>}
          position="tl"
        >
          <MenuItem>
            <h3 className="text-sm font-medium mb-2">{t("help.title")}</h3>
          </MenuItem>
          <MenuItem>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.1") }} />
          </MenuItem>
          <MenuItem>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.2") }} />
          </MenuItem>
          <MenuItem>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.3") }} />
          </MenuItem>
          <MenuItem>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.4") }} />
          </MenuItem>
          <MenuItem noBorder>
            <p className="text-xs" dangerouslySetInnerHTML={{ __html: t("help.5") }} />
          </MenuItem>
        </Menu>
      </Corner>

      {/* Top Right - Tools */}
      <Corner position="tr">
        <Button
          variant={activeTool === "pen" ? "active" : "default"}
          onClick={() => handleToolChange("pen")}
          title="D / P"
        >
          {t("tools.pen.title")}
        </Button>
        <Button
          variant={activeTool === "text" ? "active" : "default"}
          onClick={() => handleToolChange("text")}
          title="W / T"
          className="ml-2"
        >
          {t("tools.text.title")}
        </Button>
        <Button
          variant={activeTool === "move" ? "active" : "default"}
          onClick={() => handleToolChange("move")}
          title="M / V / A"
          className="ml-2"
        >
          {t("tools.move.title")}
        </Button>
      </Corner>

      {/* Bottom Left - Settings */}
      <Corner position="bl">
        <Menu trigger={<Button>{t("settings.title")}</Button>} position="bl">
          <MenuItem>
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
          <MenuItem>
            <div className="flex items-center justify-between">
              <span>{t("settings.color")}</span>
              <div className="flex gap-1">
                <Button
                  variant={color === "#000000" ? "active" : "grey"}
                  onClick={() => setColor("#000000")}
                  className="px-2"
                >
                  {t("settings.colorBlack")}
                </Button>
                <Button
                  variant={color === "#ffffff" ? "active" : "grey"}
                  onClick={() => setColor("#ffffff")}
                  className="px-2"
                >
                  {t("settings.colorWhite")}
                </Button>
                <Button
                  variant={color === "#0000ff" ? "active" : "grey"}
                  onClick={() => setColor("#0000ff")}
                  className="px-2"
                >
                  {t("settings.colorBlue")}
                </Button>
                <Button
                  variant={color === "#ff0000" ? "active" : "grey"}
                  onClick={() => setColor("#ff0000")}
                  className="px-2"
                >
                  {t("settings.colorRed")}
                </Button>
              </div>
            </div>
          </MenuItem>
          <MenuItem>
            <div className="flex items-center justify-between">
              <span>{t("settings.background")}</span>
              <div className="flex gap-1">
                <Button
                  variant={background === "#ffffff" ? "active" : "grey"}
                  onClick={() => setBackground("#ffffff")}
                  className="px-2"
                >
                  {t("settings.colorWhite")}
                </Button>
                <Button
                  variant={background === "#000000" ? "active" : "grey"}
                  onClick={() => setBackground("#000000")}
                  className="px-2"
                >
                  {t("settings.colorBlack")}
                </Button>
              </div>
            </div>
          </MenuItem>
          <MenuItem noBorder>
            <div className="flex items-center justify-between">
              <span>{t("settings.strokeWidth")}</span>
              <div className="flex gap-1 items-center">
                <Button onClick={() => setStrokeWidth(strokeWidth - 1)} className="px-2">-</Button>
                <span className="w-8 text-center">{strokeWidth}</span>
                <Button onClick={() => setStrokeWidth(strokeWidth + 1)} className="px-2">+</Button>
              </div>
        </div>
          </MenuItem>
        </Menu>

        {canvasFilled && (
          <Button
            variant="grey"
            onClick={() => setShowClearModal(true)}
            className="ml-2"
          >
            {t("general.new")}
          </Button>
        )}
      </Corner>

      {/* Bottom Right - Encrypt/Save/Send */}
      <Corner position="br">
        {!savedUrl ? (
          <Menu
            trigger={
              <Button variant={canvasFilled ? "default" : "inactive"} disabled={!canvasFilled}>
                {t("tools.encrypt.title")}
              </Button>
            }
            position="br"
          >
            <MenuItem>
              <div className="mb-2">
                <label className="block mb-1 text-xs">{t("tools.encrypt.enterPassword")}</label>
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
            <MenuItem noBorder>
              <Button
                onClick={handleSave}
                disabled={!canvasFilled || isSaving}
                variant={canvasFilled && !isSaving ? "default" : "inactive"}
                className="w-full text-center"
              >
                {isSaving ? "..." : password.length > 0 ? t("tools.encrypt.saveEncrypted") : t("tools.encrypt.saveDecrypted")}
              </Button>
            </MenuItem>
          </Menu>
        ) : (
          <Menu trigger={<Button variant="active">{t("tools.send.title")}</Button>} position="br">
            <MenuItem>
              <p className="text-xs mb-2">{t("tools.send.findMessageAt")}</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={savedUrl}
                  readOnly
                  className="flex-1 text-xs"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button onClick={handleCopyUrl} className="px-2">Copy</Button>
              </div>
            </MenuItem>
            <MenuItem noBorder>
              <a
                href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
                className="block text-center hover:underline"
              >
                {t("general.open")} →
              </a>
            </MenuItem>
          </Menu>
        )}
      </Corner>

      {/* Clear Canvas Modal */}
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)}>
        <ModalContent>
          <p>{t("general.confirmClearCanvas")}</p>
        </ModalContent>
        <ModalActions>
          <ModalAction onClick={() => setShowClearModal(false)}>
            {t("general.cancel")}
          </ModalAction>
          <ModalAction onClick={handleClear}>
            {t("general.confirm")}
          </ModalAction>
        </ModalActions>
      </Modal>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <DrawingTool />
    </ThemeProvider>
  );
}
