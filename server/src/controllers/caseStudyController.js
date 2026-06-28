import CaseStudy from "../models/CaseStudy.js";


export const createCaseStudy = async (req, res) => {
    try {
         if (req.body.status === "Published") {
      req.body.publicationDate = new Date();
    }
        const caseStudy = await CaseStudy.create({
  title: req.body.title,
  author: req.body.author,
  authorRole: req.body.authorRole,
  category: req.body.category,
  duration: req.body.duration,

  publicationDate: req.body.publicationDate,

  summary: req.body.summary,
  challenges: req.body.challenges,
  results: req.body.results,

  authorWebsite: req.body.authorWebsite,

  coverImage: req.body.coverImage,
  authorImage: req.body.authorImage,

  status: req.body.status,
});
         res.status(201).json({
      success: true,
      message: "Case study created successfully.",
      caseStudy,
    });

    } catch (err) {
  console.error("Create Case Study Error:", err);

  res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });
}
};
export const getCaseStudies = async (req, res) => {

    const studies = await CaseStudy.find().sort({
        createdAt: -1
    });

    res.json(studies);

};
export const getCaseStudy = async(req,res)=>{

try{


const study = await CaseStudy.findById(
req.params.id
);



if(!study){

return res.status(404).json({
message:"Case Study Not Found"
});

}

res.json(study);

}

catch(err){

res.status(500).json({
message:err.message
});

}

}
export const updateCaseStudy = async(req,res)=>{

try{

if(req.body.status==="Published" && !req.body.publicationDate){

req.body.publicationDate=new Date();

}

const study = await CaseStudy.findByIdAndUpdate(

req.params.id,

req.body,

{
returnDocument:"after",
runValidators:true
}

);

res.json({

success:true,

study

});

}

catch(err){

res.status(500).json({

message:err.message

});

}

}
export const deleteCaseStudy = async (req, res) => {

    await CaseStudy.findByIdAndDelete(req.params.id);

    res.json({
        message: "Case Study deleted successfully"
    });

};