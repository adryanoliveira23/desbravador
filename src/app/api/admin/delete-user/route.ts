import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json(
        { error: "UID é obrigatório." },
        { status: 400 },
      );
    }

    console.log(`[Admin] Iniciando exclusão do usuário: ${uid}`);

    // Tenta deletar do Firebase Authentication
    try {
      await adminAuth.deleteUser(uid);
      console.log(`[Admin] Usuário removido do Firebase Auth: ${uid}`);
    } catch (authError: unknown) {
      if (
        authError &&
        typeof authError === "object" &&
        "code" in authError &&
        authError.code === "auth/user-not-found"
      ) {
        console.warn(`[Admin] Usuário não encontrado no Firebase Auth: ${uid}`);
      } else {
        console.error(`[Admin] Erro ao deletar do Firebase Auth:`, authError);
        throw authError; // Re-lança se for um erro crítico
      }
    }

    // Tenta deletar do Firestore
    try {
      await adminDb.collection("users").doc(uid).delete();
      console.log(`[Admin] Documento removido do Firestore: ${uid}`);
    } catch (dbError) {
      console.error(`[Admin] Erro ao deletar do Firestore:`, dbError);
      // Não lançamos erro aqui se o Auth já foi (ou não existia), para tentar garantir a limpeza
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido.";
    console.error(`[Admin] Erro crítico na rota de exclusão:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
