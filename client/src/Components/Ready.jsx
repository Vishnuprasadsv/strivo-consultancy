import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Settings,
  WorkspacePremium,
  ArrowForward,
} from "@mui/icons-material";

function Ready() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[var(--color-main-bg)]">
      <div className="max-w-[960px] md:max-w-full mx-auto py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="bg-white border border-black/5 rounded-[20px] relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.03)] p-5 sm:p-6 md:p-10 lg:p-16 text-center w-full sm:max-w-[540px] md:max-w-full mx-auto md:h-[500px] flex flex-col justify-center">
          {/* Glow Effects */}
          <div
            className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[350px] md:w-[600px] lg:w-[800px] pointer-events-none z-10"
            style={{
              height: '800px',
              maxHeight: '150%',
              background: "radial-gradient(circle, rgba(37,99,235,0.06), transparent 70%)"
            }}
          />

          {/* Animated Rotating Globe Graphic in Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] lg:w-[550px] h-[300px] md:h-[450px] lg:h-[550px] flex items-center justify-center pointer-events-none opacity-25 z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="w-full h-full flex items-center justify-center"
            >
              <svg width="100%" height="100%" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto scale-110">
                <circle cx="180" cy="180" r="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                <ellipse cx="180" cy="180" rx="140" ry="40" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                <ellipse cx="180" cy="180" rx="140" ry="85" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                <ellipse cx="180" cy="180" rx="40" ry="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                <ellipse cx="180" cy="180" rx="85" ry="140" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" />
                
                <circle cx="100" cy="120" r="3" fill="#3b82f6" />
                <circle cx="100" cy="120" r="7" fill="#3b82f6" opacity="0.25" />
                
                <circle cx="260" cy="120" r="3" fill="#3b82f6" />
                <circle cx="260" cy="120" r="7" fill="#3b82f6" opacity="0.25" />

                <circle cx="180" cy="80" r="2" fill="#3b82f6" />
                <circle cx="180" cy="280" r="2" fill="#3b82f6" />

                <circle cx="115" cy="235" r="3" fill="#3b82f6" />
                <circle cx="115" cy="235" r="7" fill="#3b82f6" opacity="0.25" />

                <circle cx="245" cy="235" r="3.5" fill="#3b82f6" />
                <circle cx="245" cy="235" r="8" fill="#3b82f6" opacity="0.25" />
              </svg>
            </motion.div>
          </div>

          <div className="relative z-20 max-w-[700px] md:max-w-[1000px] lg:max-w-[1200px] mx-auto w-full">
            {/* Subheading */}
            <p className="text-[#3b82f6] font-bold text-[11px] sm:text-[12px] md:text-[12px] lg:text-[14px] tracking-[3px] md:tracking-[5px] uppercase mb-3 mt-7 md:mb-4">
              Let's Build What's Next
            </p>

            {/* Heading */}
            <h2 className="text-[#0f172a] font-extrabold text-[22px] sm:text-[32px] md:text-[36px] lg:text-[42px] leading-tight mb-3 md:mb-6">
              Ready to <span className="text-[#2563eb]">Transform</span> Your Business?
            </h2>

            {/* Description */}
            <p className="text-[#475569] text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed max-w-[520px] md:max-w-[700px] lg:max-w-[800px] mx-auto mb-6 md:mb-10">
              Partner with experienced consultants to unlock growth opportunities,
              streamline operations, and build long-term success.
            </p>

            {/* Value Props Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 lg:gap-10 mb-6 md:mb-10 justify-center">
              {/* Prop 1 */}
              <div className="flex flex-row sm:flex-col items-center text-left sm:text-center gap-4 sm:gap-3 md:gap-4 max-w-[280px] sm:max-w-none mx-auto w-full">
                <div className="w-9 sm:w-10 md:w-10 lg:w-12 h-9 sm:h-10 md:h-10 lg:h-12 rounded-full border border-blue-500/30 flex items-center justify-center text-[#3b82f6] bg-blue-500/5 shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 lg:w-6 md:h-5 lg:h-6" />
                </div>
                <div>
                  <h3 className="text-[#0f172a] font-bold text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] mb-1 sm:mb-2 md:mb-2">
                    Drive Growth
                  </h3>
                  <p className="text-[#475569] text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed">
                    Identify new opportunities and accelerate results.
                  </p>
                </div>
              </div>

              {/* Prop 2 */}
              <div className="flex flex-row sm:flex-col items-center text-left sm:text-center gap-4 sm:gap-3 md:gap-4 max-w-[280px] sm:max-w-none mx-auto w-full">
                <div className="w-9 sm:w-10 md:w-10 lg:w-12 h-9 sm:h-10 md:h-10 lg:h-12 rounded-full border border-blue-500/30 flex items-center justify-center text-[#3b82f6] bg-blue-500/5 shrink-0">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 lg:w-6 md:h-5 lg:h-6" />
                </div>
                <div>
                  <h3 className="text-[#0f172a] font-bold text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] mb-1 sm:mb-2 md:mb-2">
                    Optimize Operations
                  </h3>
                  <p className="text-[#475569] text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed">
                    Streamline processes and improve efficiency.
                  </p>
                </div>
              </div>

              {/* Prop 3 */}
              <div className="flex flex-row sm:flex-col items-center text-left sm:text-center gap-4 sm:gap-3 md:gap-4 max-w-[280px] sm:max-w-none mx-auto w-full">
                <div className="w-9 sm:w-10 md:w-10 lg:w-12 h-9 sm:h-10 md:h-10 lg:h-12 rounded-full border border-blue-500/30 flex items-center justify-center text-[#3b82f6] bg-blue-500/5 shrink-0">
                  <WorkspacePremium className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 lg:w-6 md:h-5 lg:h-6" />
                </div>
                <div>
                  <h3 className="text-[#0f172a] font-bold text-[13px] sm:text-[14px] md:text-[14px] lg:text-[15px] mb-1 sm:mb-2 md:mb-2">
                    Build Lasting Success
                  </h3>
                  <p className="text-[#475569] text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed">
                    Create sustainable value and long-term impact.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center mt-2 md:mt-4">
              <button
                onClick={() => navigate("/contact")}
                className="pl-5 pr-8 py-2 md:py-2.5 md:pl-6 md:pr-10 md:text-[14px] lg:text-[15px] rounded-[3px] font-bold text-[14px] text-white bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-[0_8px_25px_rgba(37,99,235,0.18)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 md:gap-3 cursor-pointer"
              >
                <div className="w-[22px] h-[22px] md:w-[20px] md:h-[20px] rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowForward className="text-[12px] sm:text-[14px] md:text-[12px] text-white" />
                </div>
                Contact Us
              </button>

              <p className="text-[#475569] text-[12.5px] md:text-[13px] mt-4 max-w-[180px] md:max-w-none leading-relaxed">
                Let's start a conversation about your goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ready;
