'use client';

import { useAudioContext } from '@/app/providers/AudioContextProvider';
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaLock, FaFileDownload } from "react-icons/fa";
import IntegrityButton from "../components/IntegrityButton";
import IntegrityFooter from "../components/footer";
import IntegrityHeader from "../components/header";
import { useShippingToolContext } from "../providers/ShippingToolProvider";
import { colors } from "../tokens/colors";
import Toast from '../components/Toast';

export default function AdminUpdates() {

    const [hasAccess, setHasAccess] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isEmailValid, setIsEmailValid] = React.useState(false);
    const { audioRef } = useAudioContext();

    // const { recordsNotShipped, updateShippedStatus } = useShippingToolContext();
    const { recordsNotShipped } = useShippingToolContext();

    const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = React.useState<string | null>(null);
    const [quantityToShip, setQuantityToShip] = React.useState<number | null>(null);
    const [toolMode, setToolMode] = React.useState<"trackingConfirmation" | "informationUpdate">("informationUpdate");
    const [address, setAddress] = React.useState<{ name: string; line_1: string; line_2?: string; city: string; state: string; zip: string; } | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    React.useEffect(() => {
        checkIsAdminOnLoad();
    }, []);

    // NEXT_PUBLIC_ADMIN_EMAIL
    // const handleAccess = async () => {
    //     const isAdminEmail = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    //     const checkLocalStorage = localStorage.getItem('integrity-admin-email');

    //     if (isAdminEmail && !checkLocalStorage) {
    //         localStorage.setItem('integrity-admin-email', email);
    //         setHasAccess(true);
    //     } else if (isAdminEmail && checkLocalStorage) {
    //         setHasAccess(true);
    //     } else {
    //         alert('You are not that guy pal, trust me, you are not that guy.');
    //     }
    // }

    const checkIsAdminOnLoad = () => {
        stopMusicTrack();
        console.log('checkIsAdminOnLoad', isEmailValid);
        const checkLocalStorage = localStorage.getItem('integrity-admin-email');
        if (checkLocalStorage) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue));
    }

    React.useEffect(() => {
        if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            localStorage.setItem('integrity-admin-email', email);
            setHasAccess(true);
        }
    }, [email]);

    const stopMusicTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }

    const selectOrder = (orderId: string) => {
        setTrackingNumber(null);
        setAddress(null);
        setQuantityToShip(null);
        setSelectedOrder(null);

        setSelectedOrder(orderId);
        const foundAddress = recordsNotShipped.find(record => record.id === orderId)?.address;
        setAddress(foundAddress || null);
        console.log('Selected order:', recordsNotShipped.find(record => record.id === orderId));
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
    // const testEmail = "deanandnostrand@gmail.com";
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
                const doc = new jsPDF();
                
                // Add title
                doc.setFontSize(16);
                doc.text('Orders to Ship', 14, 15);
                
                // Add date
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

                // Prepare table data
                const tableData = recordsNotShipped.map(record => {
                    const address = record.address;
                    const fullAddress = address ? [
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

                // Save the PDF
                doc.save('orders-to-ship.pdf');
            });
        });
    };

    return (
        <>
            <IntegrityHeader showHeader={true} />

            <div className="flex flex-row items-center place-content-center justify-evenly h-screen w-full">

                {hasAccess && (
                    <>
                        <div className="flex flex-row w-full h-full  px-4 gap-4  max-w-[700px] max-h-[500px] ">
                            <div className="flex flex-col w-full h-full gap-8">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <h1 className={styles.header}>Orders That Have Not Been Shipped Yet:</h1>
                                    <p className={styles.paragraph}>Once you select an order and click the button on the right, the order will be confirmed, and an update will be automatically sent to the customer. The email will no longer appear in this list as it will be marked as shipped!</p>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="flex items-center gap-2 mt-2 px-4 py-2 bg-[#977B49] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <FaFileDownload />
                                        Download PDF
                                    </button>
                                </div>
                                <div className="flex flex-col justify-start h-full w-full overflow-y-auto rounded-lg border border-gray-200">
                                    <table className={styles.table}>
                                        <thead className={styles.thead}>
                                            <tr>
                                                <th className={styles.th}>Name</th>
                                                <th className={styles.th}>Email</th>
                                                <th className={styles.th}>Address</th>
                                                <th className={styles.th}>Quantity to Ship</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recordsNotShipped.map((record) => (
                                                <tr
                                                    key={record.id}
                                                    onClick={() => selectOrder(record.id)}
                                                    className={`${styles.tr} ${selectedOrder === record.id ? styles.selectedRow : ''}`}
                                                >
                                                    <td className={styles.td}>{record.name}</td>
                                                    <td className={styles.td}>{record.email}</td>
                                                    <td className={styles.td}>{record.address?.line_1}</td>
                                                    <td className={styles.td}>{record.quantity_to_ship}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* NOTE: WHERE THE SEND BUTTONS FOR TESTING ARE LOCATED */}
                                <div className="flex flex-col w-full h-max gap-2">

                                    {/* <button onClick={() => sendNextStepsEmail(recordsNotShipped[0].email, recordsNotShipped[0].name, recordsNotShipped[0].address as { name: string; line_1: string; line_2?: string; city: string; state: string; zip: string; }, recordsNotShipped[0].quantity_to_ship as number)}>Send Next Steps Email</button>
                        <button onClick={() => sendShippingConfirmationEmail(recordsNotShipped[0].email, recordsNotShipped[0].name, recordsNotShipped[0].tracking_number as string)}>Send Shipping Confirmation Email</button> */}
                                    {/* <button className="hover:cursor-pointer bg-[#977B49] text-white px-4 py-2 rounded-md" onClick={() => sendNextStepsEmail(testEmail, testName, testAddress, testQuantityToShip)}>Send Next Steps Email</button>
                            <button className="hover:cursor-pointer bg-[#977B49] text-white px-4 py-2 rounded-md" onClick={() => sendShippingConfirmationEmail(testEmail, testName, testTrackingNumber)}>Send Shipping Confirmation Email</button> */}
                                </div>
                            </div>
                            <div className="flex rounded-lg border border-gray-200 flex-col justify-between px-4 mb-8 gap-2 h-max place-self-end">
                                <button
                                    className="hover:cursor-pointer"
                                    onMouseEnter={() => {
                                        const container = document.querySelector('.overflow-y-auto');
                                        if (container) container.scrollTop = 0;
                                    }}
                                >
                                    Top
                                </button>
                                <span></span>
                                <button
                                    className="hover:cursor-pointer"
                                    onMouseEnter={() => {
                                        const container = document.querySelector('.overflow-y-auto');
                                        if (container) container.scrollTop = container.scrollHeight;
                                    }}
                                >
                                    Bottom
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-full flex flex-col items-center justify-start p-4 max-w-[500px] max-h-[500px]">

                            <div className="flex flex-col w-max gap-4 place-content-center place-items-center justify-center">

                                <div className="flex flex-row w-full h-full gap-4 place-items-center justify-center p-2 border border-gray-200 rounded-lg p-4 gap-8">
                                    <button className={`hover:cursor-pointer px-4 py-2 rounded-full ${toolMode === "trackingConfirmation" ? "bg-[#977B49] text-white" : ""}`} onMouseEnter={() => setToolMode("trackingConfirmation")}>Confirm Shipment</button>
                                    <button className={`hover:cursor-pointer px-4 py-2 rounded-full ${toolMode === "informationUpdate" ? "bg-[#977B49] text-white" : ""}`} onMouseEnter={() => setToolMode("informationUpdate")}>Update Information</button>
                                </div>

                                {/* the selected order will be shown here */}
                                {toolMode === "trackingConfirmation" && (
                                    <>
                                        {selectedOrder &&
                                            <>

                                                <div className="flex flex-col w-full h-full gap-8" >

                                                    <div className="grid grid-cols-2 w-full h-full">
                                                        <p className="text-md font-bold">Selected Order:</p>
                                                        <p className="text-md font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(selectedOrder)}>{selectedOrder}</p>
                                                        <p className="text-md font-bold">Name:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.name || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.name}</p>
                                                        <p className="text-md font-bold">Email:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.email || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.email}</p>
                                                        <p className="text-md font-bold">Address:</p>
                                                        <div className="flex place-self-end flex-col w-full h-full">
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={handleCopyFullAddress}>Click to copy full address</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1 || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2 || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip}</p>
                                                        </div>
                                                        <p className="text-md font-bold">Quantity to Ship:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship?.toString() || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship}</p>


                                                    </div>

                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        {/* enter tracking number here */}
                                                        <input value={trackingNumber || ''} onChange={(e) => setTrackingNumber(e.target.value)} type="text" placeholder="Tracking Number" className="w-full max-w-[300px]  p-2 border border-gray-300 rounded-md" />
                                                    </div>

                                                    {/* TODO */}
                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        <IntegrityButton backgroundColor="#977B49" onClick={() => {
                                                            // updateShippedStatus(selectedOrder as Id<"stripeLogs">, true, trackingNumber as string, address as { name: string; line_1: string; line_2?: string; city: string; state: string; zip: string; });
                                                            console.log(selectedOrder, trackingNumber, address, quantityToShip);
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
                                                        <p className="text-md font-bold">Selected Order:</p>
                                                        <p className="text-md font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(selectedOrder)}>{selectedOrder}</p>
                                                        <p className="text-md font-bold">Name:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.name || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.name}</p>
                                                        <p className="text-md font-bold">Email:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.email || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.email}</p>
                                                        <p className="text-md font-bold">Address:</p>
                                                        <div className="flex place-self-end flex-col w-full h-full">
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={handleCopyFullAddress}>Click to copy full address</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1 || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_1}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2 || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.line_2}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.city}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.state}</p>
                                                            <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.address?.zip}</p>
                                                        </div>
                                                        <p className="text-md font-bold">Quantity to Ship:</p>
                                                        <p className="text-md place-self-end font-bold text-[#977B49] cursor-pointer hover:opacity-80" onClick={() => handleCopy(recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship?.toString() || '')}>{recordsNotShipped.find(record => record.id === selectedOrder)?.quantity_to_ship}</p>


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

                                                    {/* TODO */}
                                                    <div className="flex flex-col w-full h-full gap-4 place-items-center">
                                                        <IntegrityButton backgroundColor="#977B49" onClick={() => {
                                                            console.log(selectedOrder, trackingNumber, address, quantityToShip);
                                                        }}>Update Information</IntegrityButton>
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

                {!hasAccess && (
                      <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex h-[100dvh] items-center justify-center px-4 overflow-hidden w-full max-w-[800px]"
                  >
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="w-[90%] sm:w-[50%] max-h-[70dvh] bg-[#1a1a1a] rounded-2xl py-12 px-6 flex flex-col items-center gap-8"
                      >
                          <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                              className="relative p-[30px] flex items-center justify-center rounded-full"
                          >
                              {[...Array(8)].map((_, i) => (
                                  <motion.span
                                      key={i}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{
                                          duration: 0.3,
                                          delay: 0.6 + (i * 0.1),
                                      }}
                                      className="absolute w-2 h-2 bg-gray-600 translate-x-[-50%] translate-y-[-50%] rounded-full"
                                      style={{
                                          top: `${50 - 45 * Math.sin(i * Math.PI / 4)}%`,
                                          left: `${50 - 45 * Math.cos(i * Math.PI / 4)}%`,
                                      }}
                                  />
                              ))}
                              <FaLock className="text-4xl text-[#C4A962]" />
                          </motion.div>
  
                          <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.6 }}
                              className="w-full max-w-md space-y-6"
                          >
                              <div className="space-y-2">
                                  <motion.label
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4, delay: 0.7 }}
                                      style={{
                                          fontFamily: 'boldMain',
                                      }}
                                      className="block text-gray-400 text-sm font-bold"
                                  >
                                      Email:
                                  </motion.label>
                                  <motion.input
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4, delay: 0.8 }}
                                      type="email"
                                      value={email}
                                      onChange={handleEmailChange}
                                      placeholder="Enter your email"
                                      style={{
                                          backgroundColor: colors.grey,
                                          fontFamily: 'main',
                                      }}
                                      className="w-full p-3 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#C4A962]"
                                  />
                              </div>
  
                              <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 1 }}
                                  className="w-full h-px bg-gray-700 my-6"
                              />

                          </motion.div>
                      </motion.div>
                  </motion.div>
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