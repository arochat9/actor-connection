import { NextResponse } from 'next/server';
import { Actor } from "@service-user-for-actor-apps/sdk";
import { client } from '../../../../lib/client';

export async function GET() {
  const actors = [];
  for await (const obj of client(Actor).asyncIter()) {
    actors.push(obj);
  }
  
  return NextResponse.json({ actors });
} 