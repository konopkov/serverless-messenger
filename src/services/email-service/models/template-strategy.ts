export interface TemplateStrategyInterface {
    render(data: Record<string, unknown>, template?: string): string;
}
