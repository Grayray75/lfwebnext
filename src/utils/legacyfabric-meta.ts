import { getJson } from './request';

type GameVersionInfo = {
    version: string;
    stable: boolean;
};

export async function getGameVersions(): Promise<GameVersionInfo[]> {
    return await getJson('https://meta.legacyfabric.net/v1/versions/game');
}

type LoaderVersionInfo = {
    loader: {
        separator: string;
        build: number;
        maven: string;
        version: string;
        stable: boolean;
    };
    mappings: {
        gameVersion: string;
        separator: string;
        build: number;
        maven: string;
        version: string;
        stable: boolean;
    };
};

export async function getLoaderVersions(minecraftVersion: string): Promise<LoaderVersionInfo[]> {
    return await getJson(`https://meta.legacyfabric.net/v1/versions/loader/${minecraftVersion}`);
}

type ModrinthModVersionInfo = {
    game_versions: string[];
    loaders: string[];
    id: string;
    project_id: string;
    author_id: string;
    featured: boolean;
    name: string;
    version_number: string;
    changelog: string;
    changelog_url: string | null;
    date_published: string; // ISO 8601 timestamp
    downloads: number;
    version_type: string;
    status: string;
    requested_status: string | null;
    files: {
        hashes: {
            sha512: string;
            sha1: string;
        };
        url: string;
        filename: string;
        primary: boolean;
        size: number;
        file_type: string | null;
    }[];
    dependencies: any[];
};

export async function getApiVersions(): Promise<ModrinthModVersionInfo[]> {
    return await getJson('https://api.modrinth.com/v2/project/legacy-fabric-api/version');
}
