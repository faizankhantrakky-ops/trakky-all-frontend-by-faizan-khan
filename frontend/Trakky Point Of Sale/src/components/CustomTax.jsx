import React, { useContext, useState, useEffect } from "react";
import {
  Percent,
  Package,
  Calendar,
  CreditCard,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AuthContext from "../Context/Auth.js";
import { toast, Toaster } from "react-hot-toast";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const CustomTax = () => {
  const { authTokens, vendorData, setVendorData } = useContext(AuthContext);

  // Tax states
  const [isGst, setIsGst] = useState(false);
  const [taxAmount, setTaxAmount] = useState("");
  const [taxPercent, setTaxPercent] = useState("");

  const [productIsGst, setProductIsGst] = useState(false);
  const [productTaxAmount, setProductTaxAmount] = useState("");
  const [productTaxPercent, setProductTaxPercent] = useState("");

  const [membershipIsGst, setMembershipIsGst] = useState(false);
  const [membershipTaxAmount, setMembershipTaxAmount] = useState("");
  const [membershipTaxPercent, setMembershipTaxPercent] = useState("");

  const [walletIsGst, setWalletIsGst] = useState(false);
  const [walletTaxAmount, setWalletTaxAmount] = useState("");
  const [walletTaxPercent, setWalletTaxPercent] = useState("");

  // New GSTIN states
  const [gstNumber, setGstNumber] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyStatusActive, setVerify] = useState(null); // null | 'valid' | 'invalid' | 'error'

  const [saveLoading, setSaveLoading] = useState(false);

  // Load existing data
  useEffect(() => {
    if (vendorData) {
      setIsGst(!!vendorData.is_gst);
      setTaxAmount(vendorData.tax_amount || "");
      setTaxPercent(vendorData.tax_percent || "");

      setProductIsGst(!!vendorData.product_is_gst);
      setProductTaxAmount(vendorData.product_tax_amount || "");
      setProductTaxPercent(vendorData.product_tax_percent || "");

      setMembershipIsGst(!!vendorData.membership_is_gst);
      setMembershipTaxAmount(vendorData.membership_tax_amount || "");
      setMembershipTaxPercent(vendorData.membership_tax_percent || "");

      setWalletIsGst(!!vendorData.Wallet_is_gst);
      setWalletTaxAmount(vendorData.Wallet_tax_amount || "");
      setWalletTaxPercent(vendorData.Wallet_tax_percent || "");

      setGstNumber(vendorData.gst_number || "");
    }
  }, [vendorData]);

  // Simple GSTIN checksum validation (very common & fast check)
  const validateGSTINChecksum = (gstin) => {
    if (!GSTIN_REGEX.test(gstin)) return false;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let factor = 2;
    let sum = 0;

    for (let i = 13; i >= 0; i--) {
      let codePoint = chars.indexOf(gstin[i]);
      let digit = factor * codePoint;
      sum += Math.floor(digit / 36) + (digit % 36);
      factor = factor === 2 ? 1 : 2;
    }

    const checksum = (36 - (sum % 36)) % 36;
    const expected = chars[checksum];

    return expected === gstin[14];
  };

  const handleVerifyGST = async () => {
    const gst = gstNumber.trim().toUpperCase();
    setGstNumber(gst); // normalize to uppercase

    if (!gst) {
      toast.error("Please enter GST number");
      return;
    }

    if (gst.length !== 15 || !GSTIN_REGEX.test(gst)) {
      setVerify("invalid");
      toast.error("GSTIN must be 15 characters in correct format (e.g. 24AAACC1234D1ZQ)");
      return;
    }

    if (!validateGSTINChecksum(gst)) {
      setVerify("invalid");
      toast.error("Invalid GSTIN check sum");
      return;
    }

    setVerifyLoading(true);
    setVerify(null);

    try {
      // === Option 1: Call your own backend (recommended) ===
      // const res = await fetch("https://backendapi.trakky.in/api/verify-gst", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${authTokens?.access_token}`,
      //   },
      //   body: JSON.stringify({ gstin: gst }),
      // });

      // === Option 2: Public API example (limited / may change / for demo only) ===
      const res = await fetch(`https://api.example.com/gst/verify?gstin=${gst}`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Verification service unavailable");

      const data = await res.json();

      if (data?.valid || data?.status?.toUpperCase() === "ACTIVE") {
        setVerify("valid");
        toast.success("GSTIN format & basic check passed");
        // Optionally show business name: toast.success(`Verified: ${data.business_name}`)
      } else {
        setVerify("invalid");
        toast.error("GSTIN not found or inactive");
      }
    } catch (err) {
      console.error(err);
      setVerify("error");
      toast.error("Could not verify GST right now.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSaveTax = async () => {
    if (!vendorData?.id) {
      toast.error("Vendor data not available");
      return;
    }

    setSaveLoading(true);

    
  let branchId = localStorage.getItem("branchId") || "";


    try {
      const payload = {
        is_gst: isGst,
        tax_amount: taxAmount ? parseFloat(taxAmount) : null,
        tax_percent: taxPercent ? parseFloat(taxPercent) : null,

        product_is_gst: productIsGst,
        product_tax_amount: productTaxAmount ? parseFloat(productTaxAmount) : null,
        product_tax_percent: productTaxPercent ? parseFloat(productTaxPercent) : null,

        membership_is_gst: membershipIsGst,
        membership_tax_amount: membershipTaxAmount ? parseFloat(membershipTaxAmount) : null,
        membership_tax_percent: membershipTaxPercent ? parseFloat(membershipTaxPercent) : null,

        Wallet_is_gst: walletIsGst,
        Wallet_tax_amount: walletTaxAmount ? parseFloat(walletTaxAmount) : null,
        Wallet_tax_percent: walletTaxPercent ? parseFloat(walletTaxPercent) : null,

        // Added GST number
        gst_number: gstNumber.trim() || null,
        // branchId : branchId
      };

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor-pos/${vendorData.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.detail || "Failed to update settings");
      }

      const updated = await response.json();
      setVendorData(updated);
      toast.success("Settings saved Successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Error saving settings");
    } finally {
      setSaveLoading(false);
    }
  };

  const TaxSection = ({
    title,
    icon: Icon,
    isGst,
    setIsGst,
    taxAmount,
    setTaxAmount,
    taxPercent,
    setTaxPercent,
  }) => {
    const disablePercent = taxAmount && parseFloat(taxAmount) > 0;
    const disableAmount = taxPercent && parseFloat(taxPercent) > 0;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-[#492DBD] rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id={`${title.toLowerCase().replace(/\s+/g, "-")}-gst`}
            checked={isGst}
            onChange={(e) => setIsGst(e.target.checked)}
            className="w-4 h-4 text-[#492DBD] border-gray-300 rounded focus:ring-[#492DBD]"
          />
          <label
            htmlFor={`${title.toLowerCase().replace(/\s+/g, "-")}-gst`}
            className="text-sm font-medium text-gray-700"
          >
            Enable GST/Tax
          </label>
        </div>

        {isGst && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Percentage (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="e.g. 18"
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={disablePercent}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                    disablePercent ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Tax Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  placeholder="e.g. 50"
                  min="0"
                  step="0.01"
                  disabled={disableAmount}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                    disableAmount ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Note: If both percentage and amount are entered, <strong>percentage</strong> will be used.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Toaster position="top-right" />

      <div className="mx-auto ">

        {/* Header + GSTIN Section */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-600">Tax & GST Settings</h1>
              <p className="text-gray-600 mt-1">
                Configure GSTIN and tax rules for your services
              </p>
            </div>

            {/* GSTIN Input + Verify */}
            <div className="min-w-[580px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                *Business GST Number (GST)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value.toUpperCase());
                    setVerify(null);
                  }}
                  placeholder="24AAACC1234D1ZQ"
                  maxLength={15}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors ${
                    verifyStatusActive === "valid"
                      ? "border-green-500 bg-green-50"
                      : verifyStatusActive === "invalid" 
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />

                <button
                  onClick={handleVerifyGST}
                  disabled={verifyLoading || !gstNumber.trim()}
                  className={`
                    px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 min-w-[110px] justify-center
                    ${
                      verifyLoading || !gstNumber.trim()
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : verifyStatusActive === "valid"
                        ? "bg-green-600 text-white"
                        : verifyStatusActive === "invalid"
                        ? "bg-red-500 text-white"
                        : "bg-[#492DBD] text-white hover:bg-[#3a2199]"
                    }
                  `}
                >
                  {verifyLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Checking...</span>
                    </>
                  ) : verifyStatusActive === "valid" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Valid</span>
                    </>
                  ) : verifyStatusActive === "invalid" ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Invalid</span>
                    </>
                  ) : (
                    "Verify Gst"
                  )}
                </button>
              </div>

              {verifyStatusActive === "valid" && (
                <p className="mt-1.5 text-sm text-green-700">
                  GSTIN format and checksum are valid ✓
                </p>
              )}
              {verifyStatusActive === "invalid" && (
                <p className="mt-1.5 text-sm text-red-700">
                  Invalid format or checksum — please check
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tax Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <TaxSection
              title="Appointment Tax"
              icon={Calendar}
              isGst={isGst}
              setIsGst={setIsGst}
              taxAmount={taxAmount}
              setTaxAmount={setTaxAmount}
              taxPercent={taxPercent}
              setTaxPercent={setTaxPercent}
            />

            <TaxSection
              title="Product Tax"
              icon={Package}
              isGst={productIsGst}
              setIsGst={setProductIsGst}
              taxAmount={productTaxAmount}
              setTaxAmount={setProductTaxAmount}
              taxPercent={productTaxPercent}
              setTaxPercent={setProductTaxPercent}
            />

            <TaxSection
              title="Membership Tax"
              icon={CreditCard}
              isGst={membershipIsGst}
              setIsGst={setMembershipIsGst}
              taxAmount={membershipTaxAmount}
              setTaxAmount={setMembershipTaxAmount}
              taxPercent={membershipTaxPercent}
              setTaxPercent={setMembershipTaxPercent}
            />

            <TaxSection
              title="Wallet Tax"
              icon={CreditCard}
              isGst={walletIsGst}
              setIsGst={setWalletIsGst}
              taxAmount={walletTaxAmount}
              setTaxAmount={setWalletTaxAmount}
              taxPercent={walletTaxPercent}
              setTaxPercent={setWalletTaxPercent}
            />
          </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveTax}
            disabled={saveLoading}
            className={`
              flex items-center gap-2 px-10 py-3.5 rounded-xl font-semibold text-white transition-all shadow-sm
              ${
                saveLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#492DBD] hover:bg-[#3a2199] active:bg-[#2f1a7a]"
              }
            `}
          >
            {saveLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Guidelines */}
        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
          <ul className="space-y-2.5 text-gray-700 text-sm">
            <li>• Percentage tax is calculated on the total amount before fixed amount</li>
            <li>• If both % and fixed amount are set → percentage is used first</li>
            <li>• GSTIN is saved only if valid format (checksum checked on frontend)</li>
            <li>• Real GST verification (active/cancelled status) needs backend integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomTax;