import html2canvas from 'html2canvas';

export const html2canvasSafe = async (element, options = {}) => {
    const originalOnClone = options.onclone;

    const safeOptions = {
        ...options,
        onclone: (clonedDoc, clonedElement) => {
            // 1. Strip 'oklch' and 'oklab' from all <style> tags
            clonedDoc.querySelectorAll('style').forEach(style => {
                try {
                    if (style.textContent.includes('oklch') || style.textContent.includes('oklab')) {
                        style.textContent = style.textContent.replace(/(oklch|oklab)\([^)]+\)/g, '#000');
                    }
                } catch (e) {
                    console.warn("Failed to sanitize style tag", e);
                }
            });

            // 2. Recursively sanitize inline styles on all elements in the clone
            const allElements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
                const el = allElements[i];
                try {
                    // Check for inline style attribute
                    const styleAttr = el.getAttribute('style');
                    if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab'))) {
                        el.setAttribute('style', styleAttr.replace(/(oklch|oklab)\([^)]+\)/g, '#000'));
                    }
                } catch (e) { }
            }

            // 3. Call original onclone if provided
            if (originalOnClone) {
                originalOnClone(clonedDoc, clonedElement);
            }
        }
    };

    return html2canvas(element, safeOptions);
};

export default html2canvasSafe;
