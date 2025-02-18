import { NextResponse } from "next/server";
import { getAppDirRequestHandler } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "../../../config/supertokens";

ensureSuperTokensInit();

const handleCall = async (request) => {
  try {
    const { method } = request;
    if (method === "OPTIONS") {
      return new NextResponse("", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
        },
      });
    }

    const callbackHandler = getAppDirRequestHandler(request);
    return await callbackHandler();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const dynamic = 'force-dynamic';
export { handleCall as GET, handleCall as POST, handleCall as DELETE, handleCall as PUT, handleCall as HEAD, handleCall as OPTIONS };