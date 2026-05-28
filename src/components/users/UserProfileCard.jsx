import {
  UserCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

function UserProfileCard({ patient }) {
  return (
    <div className="bg-blue-600 dark:bg-[#0f172a] dark:border dark:border-[#1e293b] dark:shadow-none text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-500/20 h-fit transition-colors duration-300">
      <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 transition-colors">
        <UserCircle size={42} />
      </div>

      <h2 className="text-3xl font-extrabold text-white">
        {patient.name || "User"}
      </h2>

      <p className="text-blue-100 dark:text-slate-400 mt-2 break-all transition-colors">
        {patient.email}
      </p>

      <div className="mt-8 space-y-4">
        <div className="bg-white/15 dark:bg-[#020817] dark:border dark:border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm transition-colors">
          <Phone size={20} className="dark:text-slate-400" />
          <div>
            <p className="text-sm text-blue-100 dark:text-slate-400">
              Contact
            </p>
            <p className="font-bold text-white">
              {patient.contact || "Not added"}
            </p>
          </div>
        </div>

        <div className="bg-white/15 dark:bg-[#020817] dark:border dark:border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm transition-colors">
          <Mail size={20} className="dark:text-slate-400" />
          <div>
            <p className="text-sm text-blue-100 dark:text-slate-400">
              Email
            </p>
            <p className="font-bold break-all text-white">
              {patient.email}
            </p>
          </div>
        </div>

        <div className="bg-white/15 dark:bg-[#020817] dark:border dark:border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm transition-colors">
          <MapPin size={20} className="dark:text-slate-400" />
          <div>
            <p className="text-sm text-blue-100 dark:text-slate-400">
              Address
            </p>
            <p className="font-bold text-white">
              {patient.address || "Not added"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;