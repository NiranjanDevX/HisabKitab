"""
Feature Flag Management
"""
from app.core.config import settings


class FeatureFlags:
    """Feature flag manager for progressive rollout"""
    
    @staticmethod
    def is_ai_enabled() -> bool:
        """Check if AI features are enabled"""
        return settings.ENABLE_AI_FEATURES
    
    @staticmethod
    def is_voice_input_enabled() -> bool:
        """Check if voice input is enabled"""
        return settings.ENABLE_VOICE_INPUT
    
    @staticmethod
    def is_ocr_enabled() -> bool:
        """Check if OCR is enabled"""
        return settings.ENABLE_OCR
    
    @staticmethod
    def is_3d_ui_enabled() -> bool:
        """Check if 3D UI components are enabled"""
        return settings.ENABLE_3D_UI
    
    @classmethod
    def get_all_flags(cls) -> dict:
        """Get all feature flags status"""
        return {
            "ai_features": cls.is_ai_enabled(),
            "voice_input": cls.is_voice_input_enabled(),
            "ocr": cls.is_ocr_enabled(),
            "3d_ui": cls.is_3d_ui_enabled(),
        }


feature_flags = FeatureFlags()
