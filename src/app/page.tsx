"use client";

import { useRef, useState, useCallback } from "react";
import { DrawingCanvas, useCanvasFunctions } from "@/components/canvas";
import { Modal, ModalContent, ModalActions, ModalAction, ThemeProvider, useTheme } from "@/components/ui";
import { useTranslation, type Language } from "@/lib/i18n";
import type { ToolType } from "@/types";
import { HomeInfoMenus, HomeTools, HomeSettings, HomeEncrypt } from "@/components/home/HomeControls";

function DrawingTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasFns = useCanvasFunctions(canvasRef);
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { background, setBackground, color, setColor, strokeWidth, setStrokeWidth } = useTheme();

  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const [canvasFilled, setCanvasFilled] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToolChange = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    canvasFns.setTool(tool);
  }, [canvasFns]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (value.length > 0 && canvasFilled) {
      canvasFns.restore();
      canvasFns.encrypt(value);
    } else if (value.length === 0 && isEncrypted) {
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

  const handleExportSvg = useCallback(() => {
    const svg = canvasFns.exportSVG();
    if (!svg) return;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Crytch-${Date.now()}-Encrypted-Message.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [canvasFns]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <DrawingCanvas
        onCanvasChange={setCanvasFilled}
        onEncryptedChange={setIsEncrypted}
      />

      <HomeInfoMenus t={t} />

      <HomeTools activeTool={activeTool} onToolChange={handleToolChange} t={t} />

      <HomeSettings
        t={t}
        language={language}
        availableLanguages={availableLanguages}
        onLanguageChange={(lang) => setLanguage(lang as Language)}
        color={color}
        onColorChange={setColor}
        background={background}
        onBackgroundChange={setBackground}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        onExportSvg={handleExportSvg}
        onClearCanvas={() => setShowClearModal(true)}
        showNewButton={canvasFilled}
      />

      <HomeEncrypt
        t={t}
        canvasFilled={canvasFilled}
        password={password}
        isSaving={isSaving}
        savedUrl={savedUrl}
        onPasswordChange={handlePasswordChange}
        onSave={handleSave}
        onCopyUrl={handleCopyUrl}
      />

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
