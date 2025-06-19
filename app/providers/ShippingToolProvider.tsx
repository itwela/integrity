'use client';

import React, { createContext } from "react";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { sendShippingConfirmationEmail } from "@/emails/actions";

interface ShippingUser {
    id: Id<"stripeLogs">;
    name: string;
    email: string;
    tracking_number?: string;
    address?: {
        name: string;
        line_1: string;
        line_2?: string;
        city: string;
        state: string;
        zip: string;
    };
    quantity_to_ship?: number;
}

interface ShippingToolContextProps {
    recordsNotShipped: ShippingUser[];
    updateShippedStatus: (id: Id<"stripeLogs">, has_shipped: boolean, tracking_number: string) => Promise<void>;
}

const ShippingToolContext = createContext<ShippingToolContextProps | null>(null);

export default function ShippingToolProvider({ children }: {
    children: React.ReactNode;
}) {

    const recordsNotShipped = useQuery(api.stripeLogs.getStripeLogsThatHaveNotShipped) || [];
    const updateShippedStatusMutation = useMutation(api.stripeLogs.updateShippedStatus);

    const updateShippedStatus = async (id: Id<"stripeLogs">, has_shipped: boolean, tracking_number: string) => {
        
        const record = recordsNotShipped.find(record => record.id === id);
        if (!record) {
            console.log('Record not found');
            throw new Error('Record not found');
        }
        const { email, name } = record;


        await updateShippedStatusMutation({ id, has_shipped });
        // TODO send email to user with resend and tracking number
        await sendShippingConfirmationEmail(email, name, tracking_number);
    }

    React.useEffect(() => {
        console.log(
            'First 5 records not shipped',
            recordsNotShipped.slice(0, 5)
        );
    }, [recordsNotShipped]);

    return (
        <ShippingToolContext.Provider value={{ 
            recordsNotShipped,
            updateShippedStatus
            }}>
            {children}
        </ShippingToolContext.Provider>
    );
}

export function useShippingToolContext() {
    const context = React.useContext(ShippingToolContext);
    if (!context) {
        throw new Error('useShippingToolContext must be used within a ShippingToolProvider');
    }
    return context;
}