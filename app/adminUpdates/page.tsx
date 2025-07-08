'use client';

import React, { useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import IntegrityButton from "../components/IntegrityButton";
import Toast from '../components/Toast';
import IntegrityFooter from "../components/footer";
import IntegrityHeader from "../components/header";
import { useShippingToolContext } from "../providers/ShippingToolProvider";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminUpdates() {

    const [hasAccess, setHasAccess] = React.useState(false);
    const [email] = React.useState("");
    const [isEmailValid] = React.useState(false);
    const [goodEmail, setGoodEmail] = React.useState<string | null>(null);
    const [privacyMode, setPrivacyMode] = useState(false);

    // const { recordsNotShipped, updateShippedStatus } = useShippingToolContext();
    const { recordsNotShipped, updateShippedStatus } = useShippingToolContext();

    const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = React.useState<string | null>(null);
    const [quantityToShip, setQuantityToShip] = React.useState<number | null>(null);
    const [toolMode, setToolMode] = React.useState<"trackingConfirmation" | "informationUpdate">("informationUpdate");
    const [address, setAddress] = React.useState<{ name: string; line_1: string; line_2?: string; city: string; state: string; zip: string; } | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(new Set());

    React.useEffect(() => {
        setGoodEmail(localStorage.getItem('integrity-admin-email'));
        console.log('isEmailValid', isEmailValid);
    }, []);

    const filteredRecords = React.useMemo(() => {
        if (!searchQuery) return recordsNotShipped;
        return recordsNotShipped.filter(record => 
            record.address?.line_1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.address?.line_2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.address?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.address?.zip?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [recordsNotShipped, searchQuery]);

    const handleGoodEmail = () => {
        if (goodEmail) {
            setHasAccess(true);
        }
    }

    React.useEffect(() => {
        handleGoodEmail();
    }, [goodEmail]);


    React.useEffect(() => {
        if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            localStorage.setItem('integrity-admin-email', email);
            setHasAccess(true);
        }
    }, [email]);


    const selectOrder = (orderId: string) => {
        setTrackingNumber(null);
        setAddress(null);
        setQuantityToShip(null);
        setSelectedOrder(null);

        setSelectedOrder(orderId);
        const foundAddress = recordsNotShipped.find(record => record.id === orderId)?.address;
        setAddress(foundAddress || null);
        setQuantityToShip(recordsNotShipped.find(record => record.id === orderId)?.quantity_to_ship || null);
        console.log('Selected order:', recordsNotShipped.find(record => record.id === orderId));
    }

    const toggleAddressSelection = (orderId: string) => {
        setSelectedAddresses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    }

    const styles = {
        header: "text-2xl font-bold mb-4",
        paragraph: "text-sm text-gray-600",
        table: "w-full max-w-[600px]",
        thead: "",
        th: "px-4 py-2 text-left text-sm font-medium ",
        tr: "cursor-pointer hover:bg-[#977B49] transition-colors",
        td: "px-4 py-3 border-t border-gray-200 max-w-[50px] overflow-hidden",
        selectedRow: "bg-[#977B49]"
    };

    // const testName = "John Doe";
    // const testAddress = {
    //     name: "John Doe",
    //     line_1: "123 Main St",
    //     line_2: "Apt 4B",
    //     city: "Anytown",
    //     state: "CA",
    //     zip: "12345"
    // };
    // const testQuantityToShip = 1;
    // const testTrackingNumber = "1234567890";

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setToastMessage('Copied to clipboard!');
        setShowToast(true);
    };

    const handleCopyFullAddress = () => {
        const record = recordsNotShipped.find(record => record.id === selectedOrder);
        if (!record?.address) return;

        const { name, line_1, line_2, city, state, zip } = record.address;
        const formattedAddress = [
            name,
            line_1,
            line_2,
            `${city}, ${state} ${zip}`
        ].filter(Boolean).join('\n');

        navigator.clipboard.writeText(formattedAddress);
        setToastMessage('Full address copied!');
        setShowToast(true);
    };

    const handleDownloadPDF = () => {
        // Dynamically import jsPDF and jspdf-autotable
        import('jspdf').then(({ default: jsPDF }) => {
            import('jspdf-autotable').then(({ default: autoTable }) => {
                const currentDate = new Date().toLocaleDateString();
                const doc = new jsPDF();

                // Determine which records to include in PDF
                const recordsToInclude = selectedAddresses.size > 0 
                    ? recordsNotShipped.filter(record => selectedAddresses.has(record.id))
                    : recordsNotShipped;

                // Add title with date and order count
                doc.setFontSize(16);
                doc.text(`Integrity Orders to Ship - ${currentDate}`, 14, 15);
                doc.setFontSize(14);
                doc.text(`Total Orders: ${recordsToInclude.length}`, 14, 22);

                // Prepare table data
                const tableData = recordsToInclude.map(record => {
                    const address = record.address;
                    const fullAddress = address ? [
                        address.name,
                        address.line_1,
                        address.line_2,
                        `${address.city}, ${address.state} ${address.zip}`
                    ].filter(Boolean).join('\n') : '';

                    return [
                        record.name,
                        record.email,
                        fullAddress,
                        record.quantity_to_ship?.toString() || '0'
                    ];
                });

                // Add table
                autoTable(doc, {
                    head: [['Name', 'Email', 'Address', 'Quantity to Ship']],
                    body: tableData,
                    startY: 30,
                    theme: 'grid',
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                    },
                    headStyles: {
                        fillColor: [151, 123, 73], // Your brand color #977B49
                        textColor: 255,
                        fontStyle: 'bold',
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245],
                    },
                    columnStyles: {
                        2: { cellWidth: 60 }, // Make address column wider
                    },
                });

                // Add footer
                doc.setFontSize(8);
                doc.text('Powered by Caveman Creative © 2025', 14, doc.internal.pageSize.height - 10);

                // Save the PDF with date in the filename
                doc.save(`integrity-orders-to-ship-${currentDate}.pdf`);
            });
        });
    };

    const PrivacyText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
        if (privacyMode) {
            return (
                <span className={`${className} blur-sm select-none`} style={{ filter: 'blur(4px)' }}>
                    {children}
                </span>
            );
        }
        return <span className={className}>{children}</span>;
    };

    return (
        <>
            <IntegrityHeader showHeader={true} />

            <div className="flex flex-row bg-black/90 items-center place-content-center justify-evenly h-screen w-full">

                {hasAccess && (
                    <>
                        <div className="flex flex-row w-full h-full px-4 gap-4 max-w-[700px] max-h-[500px] ">
                            <div className="flex flex-col w-full h-full gap-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <h1 className={`${styles.header} text-white`}>Orders That Have Not Been Shipped Yet:</h1>
                                    <p className={`${styles.paragraph} text-white`}>Once you select an order and click the button on the right, the order will be confirmed, and an update will be automatically sent to the customer. The email will no longer appear in this list as it will be marked as shipped!</p>
                                    <div className="flex gap-4 mt-4">
                                        <input
                                            type="text"
                                            placeholder="Search by address..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="px-4 py-2 bg-[#111] text-white border border-[#333] rounded-lg focus:outline-none focus:border-[#977B49] w-[300px]"
                                        />
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#977B49] text-white rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            <FaFileDownload />
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={() => setPrivacyMode(!privacyMode)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#333] text-white rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            {privacyMode ? <FaEyeSlash /> : <FaEye />}
                                            {privacyMode ? 'Show' : 'Hide'} Info
                                        </button>
                                        {selectedAddresses.size > 0 && (
                                            <button
                                                onClick={() => setSelectedAddresses(new Set())}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#666] text-white rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                Clear Selection
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start h-full w-full overflow-y-auto rounded-lg border border-gray-200">
                                    <table className={styles.table}>
                                        <thead className={styles.thead}>
                                            <tr>
                                                <th className={`${styles.th} text-white`}>Select</th>
                                                <th className={`${styles.th} text-white`}>Name</th>
                                                <th className={`${styles.th} text-white`}>Email</th>
                                                <th className={`${styles.th} text-white`}>Address</th>
                                                <th className={`${styles.th} text-white`}>Quantity to Ship</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRecords.map((record) => (
                                                <tr
                                                    key={record.id}
                                                    className={`${styles.tr} ${selectedOrder === record.id ? styles.selectedRow : ''}`}
                                                >
                                                    <td className={`${styles.td} text-white`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAddresses.has(record.id)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                toggleAddressSelection(record.id);
                                                            }}
                                                            className="w-4 h-4 text-[#977B49] bg-gray-100 border-gray-300 rounded focus:ring-[#977B49] focus:ring-2"
                                                        />
                                                    </td>
                                                    <td 
                                                        className={`${styles.td} text-white`}
                                                        onClick={() => selectOrder(record.id)}
                                                    >
                                                        <PrivacyText>{record.name}</PrivacyText>
                                                    </td>
                                                    <td 
                                                        className={`${styles.td} text-white`}
                                                        onClick={() => selectOrder(record.id)}
                                                    >
                                                        <PrivacyText>{record.email}</PrivacyText>
                                                    </td>
                                                    <td 
                                                        className={`${styles.td} text-white`}
                                                        onClick={() => selectOrder(record.id)}
                                                    >
                                                        <PrivacyText>{record.address?.line_1}</PrivacyText>
                                                    </td>
                                                    <td 
                                                        className={`${styles.td} text-white`}
                                                        onClick={() => selectOrder(record.id)}
                                                    >
                                                        <PrivacyText>{record.quantity_to_ship}</PrivacyText>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col w-full h-max gap-2">
                                </div>
                            </div>

                            <div className="flex flex-col w-max place-self-end place-content-end h-full gap-2">
                                <div className="flex flex-col text-right w-full h-max gap-2">
                                    <p className="text-2xl font-bold text-[#977B49]">Total: {recordsNotShipped.length}</p>
                                    {selectedAddresses.size > 0 && (
                                        <p className="text-lg font-bold text-white">Selected: {selectedAddresses.size}</p>
                                    )}
                                </div>

                                <div className="flex rounded-lg border border-gray-200 flex-col justify-between px-4 mb-8 gap-2 h-max place-self-end">
                                    <button
                                        className="hover:cursor-pointer text-white"
                                        onMouseEnter={() => {
                                            const container = document.querySelector('.overflow-y-auto');
                                            if (container) container.scrollTop = 0;
                                        }}
                                    >
                                        Top
                                    </button>
                                    <span></span>
                                    <button
                                        className="hover:cursor-pointer text-white"
                                        onMouseEnter={() => {
                                            const container = document.querySelector('.overflow-y-auto');
                                            if (container) container.scrollTop = container.scrollHeight;
                                        }}
                                    >
                                        Bottom
                                    </button> 
                                </div>
                            </div>

                        </div>

                        <div className="w-full h-full flex flex-col items-center justify-start p-4 max-w-[500px] max-h-[500px]">

                            <div className="flex flex-col w-max gap-4 place-content-center place-items-center justify-center">

                                <div className="flex flex-row w-full h-full gap-4 place-items-center justify-center p-2 border border-gray-200 rounded-lg p-4 gap-8">
                                    <button className={`hover:cursor-pointer px-4 py-2 rounded-full ${toolMode === "trackingConfirmation" ? "bg-[#977B49] text-white" : "text-white"}`} onMouseEnter={() => setToolMode("trackingConfirmation")}>Confirm Shipment</button>
                                </div>

                                {toolMode === "trackingConfirmation" && (
                                    <>
                                        {selectedOrder &&
                                            <>

                                                <div className="flex flex-col w-full h-full gap-8" >

                                                    <div className="grid grid-cols-2 w-full h-full">
                                                        <p className="text-md font-bold text-white">Selected Order:</p>
                                                        <p className="text-md font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(selectedOrder)}>
                                                            <PrivacyText>{selectedOrder}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Name:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.name || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.name}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Email:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.email || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.email}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Address:</p>
                                                        <div className="flex place-self-end flex-col w-full h-full">
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={handleCopyFullAddress}>Click to copy full address</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1 || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2 || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip}</PrivacyText>
                                                            </p>
                                                        </div>
                                                        <p className="text-md font-bold text-white">Quantity to Ship:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship?.toString() || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship}</PrivacyText>
                                                        </p>

                                                    </div>

                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        <input value={trackingNumber || ''} onChange={(e) => setTrackingNumber(e.target.value)} type="text" placeholder="Tracking Number" className="w-full max-w-[300px] p-2 border border-gray-300 rounded-md" />
                                                    </div>

                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        <IntegrityButton backgroundColor="#977B49" onClick={() => {
                                                            console.log(selectedOrder, trackingNumber, address, quantityToShip);
                                                            updateShippedStatus(selectedOrder as Id<"stripeLogs">, true, trackingNumber || '');
                                                        }}>Confirm Shipment</IntegrityButton>
                                                    </div>

                                                </div>
                                            </>
                                        }
                                    </>
                                )}

                                {toolMode === "informationUpdate" && (
                                    <>
                                        {selectedOrder &&
                                            <>

                                                <div className="flex flex-col w-full h-full gap-8" >

                                                    <div className="grid grid-cols-2 w-full h-full">
                                                        <p className="text-md font-bold text-white">Selected Order:</p>
                                                        <p className="text-md font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(selectedOrder)}>
                                                            <PrivacyText>{selectedOrder}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Name:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.name || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.name}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Email:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.email || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.email}</PrivacyText>
                                                        </p>
                                                        <p className="text-md font-bold text-white">Address:</p>
                                                        <div className="flex place-self-end flex-col w-full h-full">
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={handleCopyFullAddress}>Click to copy full address</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1 || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2 || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state}</PrivacyText>
                                                            </p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip || '')}>
                                                                <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip}</PrivacyText>
                                                            </p>
                                                        </div>
                                                        <p className="text-md font-bold text-white">Quantity to Ship:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship?.toString() || '')}>
                                                            <PrivacyText>{recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship}</PrivacyText>
                                                        </p>

                                                    </div>

                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        <input value={address?.line_1 || ''} onChange={(e) => setAddress(prev => prev ? { ...prev, line_1: e.target.value } : { name: '', line_1: e.target.value, city: '', state: '', zip: '' })} type="text" placeholder="Address Line 1" className="w-full max-w-[300px] p-2 border border-gray-300 rounded-md" />
                                                        <input value={address?.line_2 || ''} onChange={(e) => setAddress(prev => prev ? { ...prev, line_2: e.target.value } : { name: '', line_1: '', line_2: e.target.value, city: '', state: '', zip: '' })} type="text" placeholder="Address Line 2" className="w-full max-w-[300px] p-2 border border-gray-300 rounded-md" />
                                                        <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]">
                                                            <input value={address?.city || ''} onChange={(e) => setAddress(prev => prev ? { ...prev, city: e.target.value } : { name: '', line_1: '', city: e.target.value, state: '', zip: '' })} type="text" placeholder="City" className="w-full p-2 border border-gray-300 rounded-md" />
                                                            <input value={address?.state || ''} onChange={(e) => setAddress(prev => prev ? { ...prev, state: e.target.value } : { name: '', line_1: '', city: '', state: e.target.value, zip: '' })} type="text" placeholder="State" className="w-full p-2 border border-gray-300 rounded-md" />
                                                            <input value={address?.zip || ''} onChange={(e) => setAddress(prev => prev ? { ...prev, zip: e.target.value } : { name: '', line_1: '', city: '', state: '', zip: e.target.value })} type="text" placeholder="ZIP" className="w-full p-2 border border-gray-300 rounded-md" />
                                                            <input value={quantityToShip || ''} onChange={(e) => setQuantityToShip(Number(e.target.value))} type="number" placeholder="Quantity to Ship" className="w-full p-2 border border-gray-300 rounded-md" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        }
                                    </>
                                )}

                            </div>

                        </div>

                    </>
                )}

            </div>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <IntegrityFooter />
        </>
    )
}