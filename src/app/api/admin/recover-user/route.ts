import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, role, plan, ministry } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 },
      );
    }

    // Busca o usuário existente no Firebase Auth pelo e-mail
    const userRecord = await adminAuth.getUserByEmail(email);

    // Recria o documento no Firestore com o UID do Auth
    await adminDb
      .collection("users")
      .doc(userRecord.uid)
      .set({
        fullName: fullName || userRecord.displayName || "",
        email,
        role: role || "diretor",
        status: "ativo",
        createdAt: new Date().toISOString(),
        plan: plan || "bom_aventureiro",
        ministry: ministry || "desbravador",
      });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
