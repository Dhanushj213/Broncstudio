import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code || code.length !== 6) {
        return NextResponse.json({ error: 'Invalid pincode format' }, { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'pincodes.csv');
        const fileBuffer = fs.readFileSync(filePath);
        const fileContent = fileBuffer.toString();

        const lines = fileContent.split(/\r?\n/);

        // Aggregate capabilities across all providers for this pincode
        let foundAny = false;
        let anyCod = false;
        let anyPrepaid = false;

        let firstMatch = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;

            const columns = line.split(',');
            if (columns[0]?.trim() === code) {
                foundAny = true;

                const codRaw = columns[4]?.trim();
                const prepaidRaw = columns[5]?.trim();

                const cod = codRaw === 'Y';
                const prepaid = prepaidRaw === 'Y';

                if (code === '989896') {
                    console.log(`Checking 989896: Row ${i}, COD='${codRaw}'(${cod}), Prepaid='${prepaidRaw}'(${prepaid})`);
                }

                if (cod) anyCod = true;
                if (prepaid) anyPrepaid = true;

                if (!firstMatch) {
                    firstMatch = {
                        pincode: columns[0]?.trim(),
                        city: columns[2]?.trim(),
                        state: columns[3]?.trim(),
                    };
                }

                if (anyCod && anyPrepaid) break;
            }
        }

        if (foundAny) {
            const isServiceable = anyCod || anyPrepaid;

            if (isServiceable) {
                return NextResponse.json({
                    serviceable: true,
                    pincode: code,
                    city: firstMatch?.city || '',
                    state: firstMatch?.state || '',
                    cod_available: anyCod,
                    prepaid_available: anyPrepaid
                });
            } else {
                return NextResponse.json({
                    serviceable: false,
                    message: 'Pincode not serviceable (No COD/Prepaid)',
                    debug: { cod: anyCod, prepaid: anyPrepaid }
                });
            }
        } else {
            return NextResponse.json({
                serviceable: false,
                message: 'Pincode not serviceable'
            });
        }

    } catch (error) {
        console.error('Error reading pincode file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
