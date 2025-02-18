import { NextResponse } from "next/server";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { middleware } from "supertokens-node/framework/express";
import { middleware as cors } from "cors";
import supertokens from "@/config/supertokens";

export async function GET(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function POST(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function DELETE(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function PUT(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function PATCH(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function HEAD(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}

export async function OPTIONS(request) {
  return await superTokensNextWrapper(
    async (next) => {
      await middleware()(request, next);
      return await next();
    },
    request
  );
}