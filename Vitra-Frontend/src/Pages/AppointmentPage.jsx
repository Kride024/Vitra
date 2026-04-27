import React, { useEffect, useMemo, useState } from "react";
import { Search, User, ChevronLeft, ChevronRight, Calendar, Star } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { getDoctors, createAppointment } from "../api/appointment.api";
import { getMyProfile } from "../api/auth.api";

const AppointmentPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [costRange, setCostRange] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState("");
  const [patientProfile, setPatientProfile] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [healthDescription, setHealthDescription] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const [imageAttachment, setImageAttachment] = useState("");
  const [reportAttachment, setReportAttachment] = useState("");
  const pageSize = 3;

  useEffect(() => {
    const loadPageData = async () => {
      setLoadingDoctors(true);
      setDoctorsError("");

      try {
        const doctorsResponse = await getDoctors();

        const fetchedDoctors = (doctorsResponse.data?.doctors || []).map((doc) => ({
          id: doc.id,
          name: `Dr. ${doc.fullName}`,
          specialty: doc.specialty || "General Physician",
          charge: doc.consultationFee ? `$${Number(doc.consultationFee).toFixed(2)}` : "$0.00",
          availability: doc.availability || "Not specified",
          rating: doc.rating ? String(doc.rating) : "4.5",
          image: doc.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=200&h=200",
          email: doc.email,
          phone: doc.phone,
        }));

        setDoctors(fetchedDoctors);

        if (!fetchedDoctors.length) {
          setDoctorsError("No doctor accounts found in database. Register a user with role DOCTOR.");
        }
      } catch (error) {
        console.error("Failed to load appointment data:", error);
        const message = error.response?.status === 401
          ? "Session expired. Please login again to load doctors."
          : "Could not load doctors. Ensure backend server is running on port 5000.";
        setDoctorsError(message);
      } finally {
        setLoadingDoctors(false);
      }

      try {
        const profileResponse = await getMyProfile();
        setPatientProfile(profileResponse.data?.user || null);
      } catch (error) {
        console.error("Failed to load patient profile:", error);
      }
    };

    loadPageData();
  }, []);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const openBookingForm = (doctor) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
  };

  const closeBookingForm = () => {
    setShowForm(false);
    setSelectedDoctor(null);
    setHealthDescription("");
    setReportNotes("");
    setImageAttachment("");
    setReportAttachment("");
  };

  const submitAppointment = async (e) => {
    e.preventDefault();

    if (!selectedDoctor?.id) {
      return;
    }

    if (user?.role !== "PATIENT") {
      alert("Only patient accounts can book appointments.");
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({
        doctorUserId: selectedDoctor.id,
        healthDescription,
        reportNotes,
        imageAttachment,
        reportAttachment,
      });
      alert("Appointment booked successfully");
      closeBookingForm();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        doc.name.toLowerCase().includes(normalizedSearch) ||
        doc.specialty.toLowerCase().includes(normalizedSearch);

      const matchesSpecialty =
        specialtyFilter === "All" || doc.specialty === specialtyFilter;

      const fee = Number(doc.charge.replace("$", ""));
      const matchesCost =
        costRange === "All" ||
        (costRange === "$0 - $120" && fee <= 120) ||
        (costRange === "$121 - $200" && fee >= 121 && fee <= 200) ||
        (costRange === "$200+" && fee > 200);

      return matchesSearch && matchesSpecialty && matchesCost;
    });
  }, [doctors, searchTerm, specialtyFilter, costRange]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedDoctors = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [safePage, filteredDoctors]);

  return (
    <div className="min-h-screen bg-[#050a15] text-white font-sans selection:bg-blue-500/30">
     

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* 2. Header Section */}
        <div className="mb-12">
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Clinical Excellence</p>
          <h1 className="text-5xl font-bold tracking-tight">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Specialist</span></h1>
        </div>

        {/* 3. Refined Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-[#0d1425] border border-white/5 rounded-[2rem] shadow-2xl mb-12">
          <div className="space-y-2">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider ml-1">Search Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. Cardiology"
                className="w-full bg-[#050a15] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider ml-1">Specialist</label>
            <select
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#050a15] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Specialists</option>
              {[...new Set(doctors.map((doc) => doc.specialty))].map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider ml-1">Cost Range</label>
            <select
              value={costRange}
              onChange={(e) => {
                setCostRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#050a15] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Prices</option>
              <option value="$0 - $120">$0 - $120</option>
              <option value="$121 - $200">$121 - $200</option>
              <option value="$200+">$200+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("All");
                setCostRange("All");
                setCurrentPage(1);
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* 4. Doctor Cards */}
        <div className="space-y-4">
          {loadingDoctors && (
            <div className="p-6 bg-[#0d1425] border border-white/5 rounded-2xl text-center text-gray-300">
              Loading doctors...
            </div>
          )}

          {!loadingDoctors && doctorsError && (
            <div className="p-6 bg-[#2a1220] border border-red-400/20 rounded-2xl text-center text-red-200">
              {doctorsError}
            </div>
          )}

          {paginatedDoctors.map((doc) => (
            <div key={doc.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gradient-to-br from-[#0d1425] to-[#080f1e] border border-white/5 rounded-[2rem] hover:border-blue-500/30 transition-all group">
              <div className="relative">
                <img src={doc.image} alt={doc.name} className="w-28 h-28 rounded-2xl object-cover border-2 border-white/10 group-hover:border-blue-500/50 transition-all" />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1 shadow-lg">
                  <Star size={10} fill="white" /> {doc.rating}
                </div>
              </div>

              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{doc.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{doc.specialty} • Senior Consultant</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Calendar size={14} className="text-blue-500" /> {doc.availability}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                    Consultation: {doc.charge}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openBookingForm(doc)}
                className="w-full md:w-auto px-10 py-4 bg-transparent border border-white/10 rounded-2xl font-bold text-sm hover:bg-white hover:text-black transition-all"
              >
                Appoint Now
              </button>
            </div>
          ))}

          {!loadingDoctors && !doctorsError && !paginatedDoctors.length && (
            <div className="p-6 bg-[#0d1425] border border-white/5 rounded-2xl text-center text-gray-300">
              No doctors found for selected filters.
            </div>
          )}
        </div>

        {/* 5. Pagination */}
        <div className="mt-16 flex justify-center items-center gap-6">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-sm font-bold">{safePage}</span>
            <span className="text-sm text-gray-500">of {totalPages}</span>
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages}
            className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {showForm && selectedDoctor && (
          <div className="fixed inset-0 z-[1200] bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0d1425] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Book Appointment with {selectedDoctor.name}</h2>

              <form onSubmit={submitAppointment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={`${patientProfile?.firstName || user?.firstName || ""} ${patientProfile?.lastName || user?.lastName || ""}`.trim()}
                    readOnly
                    className="bg-[#050a15] border border-white/10 rounded-xl p-3 text-sm"
                  />
                  <input
                    value={patientProfile?.phone || user?.phone || ""}
                    readOnly
                    className="bg-[#050a15] border border-white/10 rounded-xl p-3 text-sm"
                  />
                  <input
                    value={patientProfile?.email || user?.email || ""}
                    readOnly
                    className="md:col-span-2 bg-[#050a15] border border-white/10 rounded-xl p-3 text-sm"
                  />
                </div>

                <textarea
                  value={healthDescription}
                  onChange={(e) => setHealthDescription(e.target.value)}
                  required
                  rows={5}
                  placeholder="Write a detailed description of your health issue"
                  className="w-full bg-[#050a15] border border-white/10 rounded-xl p-3 text-sm"
                />

                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  rows={3}
                  placeholder="Add report notes or previous diagnosis"
                  className="w-full bg-[#050a15] border border-white/10 rounded-xl p-3 text-sm"
                />

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-blue-400">Add Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const encoded = await toBase64(file);
                        setImageAttachment(encoded);
                      }}
                      className="w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-blue-400">Add Report</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const encoded = await toBase64(file);
                        setReportAttachment(encoded);
                      }}
                      className="w-full mt-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={closeBookingForm}
                    className="px-4 py-2 rounded-lg border border-white/15"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Appointment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentPage;