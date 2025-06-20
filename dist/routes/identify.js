"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post('/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Email or phoneNumber is required' });
    }
    try {
        const contacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { email: email || undefined },
                    { phoneNumber: phoneNumber || undefined },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        if (contacts.length === 0) {
            const newContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: 'PRIMARY',
                },
            });
            return res.json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: [],
                },
            });
        }
        let primary = contacts.find(c => c.linkPrecedence === 'PRIMARY') || contacts[0];
        const otherPrimaries = contacts.filter(c => c.linkPrecedence === 'PRIMARY' && c.id !== primary.id);
        for (const other of otherPrimaries) {
            await prisma.contact.update({
                where: { id: other.id },
                data: {
                    linkPrecedence: 'SECONDARY',
                    linkedId: primary.id,
                },
            });
        }
        const existingEmails = contacts.map(c => c.email);
        const existingPhones = contacts.map(c => c.phoneNumber);
        const shouldCreate = (email && !existingEmails.includes(email)) ||
            (phoneNumber && !existingPhones.includes(phoneNumber));
        if (shouldCreate) {
            await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: 'SECONDARY',
                    linkedId: primary.id,
                },
            });
        }
        const all = await prisma.contact.findMany({
            where: {
                OR: [
                    { id: primary.id },
                    { linkedId: primary.id },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        const emails = [...new Set(all.map(c => c.email).filter(Boolean))];
        const phoneNumbers = [...new Set(all.map(c => c.phoneNumber).filter(Boolean))];
        const secondaryIds = all
            .filter(c => c.linkPrecedence === 'SECONDARY')
            .map(c => c.id);
        return res.json({
            contact: {
                primaryContactId: primary.id,
                emails,
                phoneNumbers,
                secondaryContactIds: secondaryIds,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
