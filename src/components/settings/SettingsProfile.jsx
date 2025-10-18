import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { getProfile, updateProfile } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    address: {
      street: "",
      zip: "",
      city: "",
      country: "",
    },
    newsletter: false,
  });

  // Fetch profile only once (no auto reruns)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const u = res.data;

        // Split full name into first + last
        const [firstName, ...lastNameArr] = (u.name || "").split(" ");
        const lastName = lastNameArr.join(" ");

        setForm({
          firstName: firstName || "",
          lastName: lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          company: u.company || "Nabu",
          website: u.website || "",
          address: {
            street: u.address?.Stream || "",
            zip: u.address?.pinCode || "",
            city: u.address?.city || "",
            country: u.address?.country || "India",
          },
          newsletter: u.newsletter || false,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []); //  Empty array = run only once

  //  Handle Profile Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        company: form.company,
        website: form.website,
        address: {
          Stream: form.address.street,
          pinCode: form.address.zip,
          city: form.address.city,
          country: form.address.country,
        },
        newsletter: form.newsletter,
      };

      const res = await updateProfile(updatedUser);
      setUser(res.data.user); // update context only after success
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 max-w-md mx-auto mt-6 ">
      {/* Personal Info */}
      <h3 className="font-semibold text-lg ">Personal Information</h3>

      <label>Email address*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Email address*"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <label>First name*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="First name*"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        required
      />

      <label>Last name*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Last name*"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        required
      />

      <label>Phone number*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Phone number*"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      {/* Company Info */}
      <h3 className="font-semibold text-lg mt-4">Company Information</h3>

      <label>Company / Organization*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Company / Organization*"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        required
      />

      <label>Website (optional)</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Website (optional)"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />
      <small className="text-gray-500 block text-sm">
        Example: www.mywebsite.com or https://www.mywebsite.com/
      </small>

      {/* Address */}
      <h3 className="font-semibold text-lg mt-4">Address</h3>

      <label>Street address*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Street address*"
        value={form.address.street}
        onChange={(e) =>
          setForm({ ...form, address: { ...form.address, street: e.target.value } })
        }
        required
      />

      <label>ZIP code*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="ZIP code*"
        value={form.address.zip}
        onChange={(e) =>
          setForm({ ...form, address: { ...form.address, zip: e.target.value } })
        }
        required
      />

      <label>City*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="City*"
        value={form.address.city}
        onChange={(e) =>
          setForm({ ...form, address: { ...form.address, city: e.target.value } })
        }
        required
      />

      <label>Country*</label>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Country*"
        value={form.address.country}
        onChange={(e) =>
          setForm({ ...form, address: { ...form.address, country: e.target.value } })
        }
        required
      />

      {/* Newsletter */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
        />
        <span>Send me the profile update newsletter</span>
      </label>

      {/* Update button */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
      >
        Update My Profile
      </button>
    </form>
  );
}
