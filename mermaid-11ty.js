// @ts-check
import he from "he";

const DEFAULT_MERMAID_VERSION = "11.11.0";

const UNPKG_MERMAID_LINK = `https://unpkg.com/mermaid@${DEFAULT_MERMAID_VERSION}/dist/mermaid.esm.min.mjs`;

/**
 * @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 * @param {*} options
 */
export default function (eleventyConfig, options) {
  const { markdownHighlighter } = eleventyConfig;
  const src = options?.mermaid_js_src || UNPKG_MERMAID_LINK;
  const html_tag = options?.html_tag || "pre";
  const extra_classes = options?.extra_classes
    ? " " + options.extra_classes
    : "";
  const mermaid_config = {
    ...(options?.mermaid_config || {}),
    ...{
      loadOnSave: true,
      startOnLoad: true,
    },
  };

  eleventyConfig.addShortcode("mermaid_js", () => {
    return [
      `<script type="module" async>`,
      `import mermaid from "${src}";`,
      `mermaid.initialize(${JSON.stringify(mermaid_config)});`,
      `</script>`,
    ].join("\n");
  });

  eleventyConfig.addMarkdownHighlighter(
    /**
     * @param {string} str
     * @param {string} language
     */
    function (str, language) {
      if (language === "mermaid") {
        const content = he.encode(str);
        return `<${html_tag} class="mermaid${extra_classes}">${content}</${html_tag}>`;
      }
      if (markdownHighlighter) {
        return markdownHighlighter(str, language);
      }
      return `<pre class="${language}">${str}</pre>`;
    }
  );

  return {};
}
