export type ModEntry = {
    name: string;
    links: {
        github?: string | null;
        modrinth?: string | null;
        curseforge?: string | null;
    };
    working: boolean;
    versions: string[];
};
