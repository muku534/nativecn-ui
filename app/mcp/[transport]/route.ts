import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import registryData from "../../../registry/registry.json";
import { componentSourceMap, componentMetaMap } from "../../../registry/source-map";

export const runtime = "nodejs";

const ID_TO_SOURCE_KEY_OVERRIDES: Record<string, string> = {
  "bottom-navigation": "AnimatedBottomNav",
  "bottom-sheet": "DynamicBottomSheet",
};

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function resolveSourceKey(id: string): string {
  return ID_TO_SOURCE_KEY_OVERRIDES[id] ?? kebabToPascal(id);
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_components",
      {
        description:
          "List all available nativecn-ui React Native components with id, category, and difficulty.",
        inputSchema: {
          category: z
            .string()
            .optional()
            .describe("Optional filter, e.g. 'Button', 'Input'"),
        },
      },
      async ({ category }) => {
        const all = registryData.components as Array<{
          id: string;
          path: string;
          category: string;
          difficulty: string;
          version?: string;
        }>;

        const filtered = category
          ? all.filter(
              (c) => c.category.toLowerCase() === category.toLowerCase(),
            )
          : all;

        const text = filtered
          .map((c) => `- ${c.id} (${c.category}, ${c.difficulty})`)
          .join("\n");
        return {
          content: [{ type: "text", text: text || "No components found." }],
        };
      },
    );

    server.registerTool(
      "get_component",
      {
        description:
          "Fetch a nativecn-ui component by id: description, props, dependencies, usage example, and full TypeScript source.",
        inputSchema: {
          id: z
            .string()
            .describe("Component id, e.g. 'rainbow-button', 'date-picker'"),
        },
      },
      async ({ id }) => {
        const meta = componentMetaMap[id];

        if (!meta) {
          return {
            content: [
              { type: "text", text: `No component metadata found for id "${id}".` },
            ],
            isError: true,
          };
        }

        const pascalName = resolveSourceKey(id);
        const tsSource = componentSourceMap[pascalName];

        if (!tsSource) {
          return {
            content: [
              {
                type: "text",
                text: `Error: PascalCase name "${pascalName}" derived from id "${id}" does not match the actual bundled filename in componentSourceMap. (Metadata found but source file is named differently).`,
              },
            ],
            isError: true,
          };
        }

        const requiredDeps = meta.dependencies?.required?.join(", ") || "None";
        const propsTable = (meta.props ?? [])
          .map(
            (p: any) =>
              `- \`${p.name}\` (${p.type}${p.required ? ", required" : ""}): ${p.description}`,
          )
          .join("\n");
        const usage = meta.usage?.[0]?.code ?? "";

        return {
          content: [
            {
              type: "text",
              text: [
                `# ${meta.name}`,
                meta.longDescription ?? meta.description,
                "",
                "## Dependencies",
                requiredDeps,
                "",
                "## Props",
                propsTable || "None",
                "",
                "## Usage",
                "```tsx",
                usage,
                "```",
                "",
                "## Source",
                "```tsx",
                tsSource,
                "```",
              ].join("\n"),
            },
          ],
        };
      },
    );
  },
  {},
  {
    streamableHttpEndpoint: "/mcp/http",
    sseEndpoint: "/mcp/sse",
    sseMessageEndpoint: "/mcp/message",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
