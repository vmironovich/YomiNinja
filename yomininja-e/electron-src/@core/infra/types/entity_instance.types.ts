import { OcrEngineSettings, SettingsPreset, SettingsPresetProps } from "../../domain/settings_preset/settings_preset";
import { CloudVisionOcrEngineSettings } from "../ocr/cloud_vision_ocr.adapter/cloud_vision_ocr_settings";

// Ocr engine settings union type
export type OcrEngineSettingsU = CloudVisionOcrEngineSettings | OcrEngineSettings;

export type SettingsPresetInstanceProps = SettingsPresetProps< OcrEngineSettingsU >;

export type SettingsPresetInstance = SettingsPreset< SettingsPresetInstanceProps >;
