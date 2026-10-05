/* ==========================================================================
   MODULAR IMAGE LIGHTBOX
   ========================================================================== */
.sbg-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.sbg-lightbox.active {
  opacity: 1;
  visibility: visible;
}

.lightbox-overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 8, 17, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.lightbox-dialog {
  position: relative;
  z-index: 2;
  max-width: min(90vw, 1000px);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-close {
  position: absolute;
  top: -45px;
  right: 0;
  font-size: 2.2rem;
  color: var(--text-white);
  line-height: 1;
  transition: var(--transition);
}

.lightbox-close:hover {
  color: var(--aws-orange);
}

.lightbox-image {
  max-width: 100%;
  max-height: calc(85vh - 50px);
  object-fit: contain;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-glow);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
}

.lightbox-caption {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
}
