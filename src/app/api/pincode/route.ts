import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode");
  if (!pincode) {
    return NextResponse.json({ error: "PINCODE_REQUIRED" }, { status: 400 });
  }

  const service = await prisma.pincodeServiceability.findUnique({
    where: { pincode },
  });

  if (!service) {
    return NextResponse.json({ serviceable: false });
  }

  return NextResponse.json({
    serviceable: true,
    etaDays: service.etaDays,
    isCod: service.isCod,
    zone: service.zone,
    city: service.city,
    state: service.state,
  });
}
