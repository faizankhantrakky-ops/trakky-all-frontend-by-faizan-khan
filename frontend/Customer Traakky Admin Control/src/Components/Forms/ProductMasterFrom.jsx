import React, {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
} from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const ProductMasterForm = ({
  ProductmasterData,
  setProductmasterData,
  closeModal,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(ProductmasterData?.name || "");
  const [slug, setSlug] = useState(ProductmasterData?.slug || "");
  const [img, setImg] = useState(null);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImg(file);
  //     setCurrentImg(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !slug) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (img) {
      formData.append("image", img);
    }

    try {
      let response;
      if (ProductmasterData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/masterproducts/${ProductmasterData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: formData,
          }
        );
      } else {
        response = await fetch(
          "https://backendapi.trakky.in/salons/masterproducts/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: formData,
          }
        );
      }

      if (response.ok) {
        // toast.success("Product added/updated successfully!");

        setName("");
        setSlug("");
        setImg(null);
        if (ProductmasterData) {
          toast.success("Product updated successfully!");
          closeModal();
        } else {
          toast.success("Product added successfully!");
        }
      } else if (response.status === 401) {
        toast.error("You're logged out.");
        logoutUser();
      } else {
        const data = await response.json();
        toast.error(`Error: ${data?.message || "Something went wrong."}`);
      }
    } catch (error) {
      toast.error("Failed to process the request. Please try again later.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Master Product</h3>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="product-name">Name</label>
              <input
                type="text"
                name="product-name"
                id="product-name"
                placeholder="Enter Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                name="slug"
                id="slug"
                value={slug}
                placeholder="Enter Slug"
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="image">
                Product Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 1:1
                </span>
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductMasterForm;
