"use server";

import { type Client, createClient, type Osdk } from "@osdk/client";
import { createConfidentialOauthClient } from "@osdk/oauth";
import { Actor } from "@service-user-for-actor-apps/sdk";

const client_id = "35a4aa58d7ead18341627f7a6070cd54";
const url = "https://magic.usw-3.palantirfoundry.com";
const ontologyRid = "ri.ontology.main.ontology.79dee872-8094-4fe0-8a82-93d1488a2294";
const client_secret = process.env.FOUNDRY_CLIENT_SECRET;
const scopes: string[] = [
	"api:ontologies-read",
	"api:ontologies-write",
	"api:mediasets-read",
	"api:mediasets-write"
];

const auth = createConfidentialOauthClient(client_id, client_secret!, url, scopes);
export const client: Client = createClient(url, ontologyRid, auth); 

export async function testListActors() {
    const objects: Osdk.Instance<Actor>[] = [];

    for await(const obj of client(Actor).asyncIter()) {
        objects.push(obj);  
    }
    return objects;
}