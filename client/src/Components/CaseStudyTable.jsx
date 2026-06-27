import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import {
  FiEdit2,
  FiMoreVertical,
} from "react-icons/fi";

const statusColor = {
  Published:
    "bg-green-500/10 text-green-400 border border-green-500/20",

  Draft:
    "bg-orange-500/10 text-orange-400 border border-orange-500/20",

  Archived:
    "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

const categoryColor = {
  Finance: "bg-blue-500",
  Healthcare: "bg-green-500",
  Technology: "bg-purple-500",
  Retail: "bg-orange-500",
};

const CaseStudyTable = ({ caseStudies }) => {
  const navigate = useNavigate();
  const deleteCaseStudy = async (id) => {

    if (!window.confirm("Delete this case study?"))
      return;

    try {

      await axios.delete(
        `http://localhost:5000/api/case-studies/${id}`
      );

      window.location.reload();

    } catch (err) {

      console.log(err);

    }

  };
  return (
    <div
      className="
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        overflow-hidden
      "
    >
      {/* Header */}

      <div

        className="
    grid
    grid-cols-[80px_3fr_2fr_1.5fr_1.2fr_140px_120px]
    items-center
    px-6
    py-5
    text-gray-400
    text-sm
    font-semibold
    border-b
    border-slate-700
  "

      >
        <div>ID</div>
        <div>Case Study</div>
        <div>Author</div>
        <div>Category</div>
        <div>Status</div>
        <div>Published</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Rows */}

      {caseStudies.map((study) => (
        <div
          key={study.id}
          className="
            grid
             grid-cols-[80px_3fr_2fr_1.5fr_1.2fr_140px_120px]
            items-center
            px-6
            py-4
            border-b
            border-slate-800
            hover:bg-white/5
            transition
          "
        >
          {/* ID */}

          <div className="font-medium">
            {study._id.slice(-6).toUpperCase()}
          </div>

          {/* Title */}

          <div className="flex items-center gap-3 min-w-0">

            <img
              src={study.coverImage || "https://via.placeholder.com/80"}
              alt={study.title}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />

            <div className="min-w-0">

              <h3 className="font-semibold leading-6 ">
                {study.title}
              </h3>

              <p className="text-xs text-gray-400 truncate">
                {study.duration}
              </p>

            </div>

          </div>
          <div>
            <p className="font-medium text-sm">
              {study.author}
            </p>

            <p className="text-xs text-gray-400">
              {study.authorRole}
            </p>
          </div>

          {/* Industry */}

          <div className="flex items-center">

            <span
              className={`w-2.5 h-2.5 rounded-full
  ${categoryColor[study.category]}`}
            ></span>

            {study.category}


          </div>


          {/* Status */}

          <div className="flex justify-center items-center">

            <span
              className={`
                px-2
py-1
                rounded-full
                text-xs
                font-medium
                ${statusColor[study.status]}
              `}
            >
              {study.status}
            </span>

          </div>

          {/* Date */}

          <div className="flex justify-center items-center text-sm text-gray-300">
            {study.publicationDate
              ? new Date(study.publicationDate).toLocaleDateString()
              : "-"}
          </div>
          {/* Actions */}

          <div className="flex justify-center gap-2">

            <button
              className="
                w-8
h-8
                rounded-lg
                bg-slate-800
                hover:bg-blue-600
                transition
                flex
                items-center
                justify-center
              "
              onClick={() =>
                navigate(`/admin/edit-case-study/${study._id}`)
              }
            >
              <FiEdit2 />
            </button>

            <button
              onClick={() => deleteCaseStudy(study._id)}
              className="
w-8
h-8
rounded-lg
bg-red-600
hover:bg-red-700
flex
items-center
justify-center
transition
"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}

      {/* Footer */}

      <div
        className="
          flex
          justify-between
          items-center
          px-6
          py-5
        "
      >
        <p className="text-gray-400 text-sm">
          Showing {caseStudies.length} case studies
        </p>


      </div>

    </div>
  );
};

export default CaseStudyTable;