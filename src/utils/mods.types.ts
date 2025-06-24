export type ModEntry = {
    name: string;
    links: {
        github?: string;
        modrinth?: string;
        curseforge?: string;
    };
    working: boolean;
    versions: string[];
};
