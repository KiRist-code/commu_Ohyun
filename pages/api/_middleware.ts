import type { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, res: NextResponse) {
  const auth = req.headers.get("authorization");
}
