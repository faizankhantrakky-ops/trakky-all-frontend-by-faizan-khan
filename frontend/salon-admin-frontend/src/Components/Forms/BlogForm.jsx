import "../css/form.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AuthContext from "../../Context/AuthContext";
import Select from "react-select/async";

const AddBlogs = ({ blogData, closeModal }) => {
  const { authTokens } = useContext(AuthContext);
  const [title, setTitle] = useState(blogData?.title || "");
  const [author, setAuthor] = useState(blogData?.author || "");
  const [date, setDate] = useState(blogData?.date || "");
  const [metaTitle, setMetaTitle] = useState(blogData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    blogData?.meta_description || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    blogData?.meta_keywords || ""
  );
  const [slug, setSlug] = useState(blogData?.slug || "");
  const [hashtags, setHashtags] = useState(blogData?.hashtags || "");
  const [image, setImage] = useState(blogData?.image_blog?.url || null);
  const [mainImg, setMainImg] = useState(null);
  const [selectedCity, setSelectedCity] = useState(blogData?.city || "");
  const [city, setCity] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [readTime, setReadTime] = useState(blogData?.read_time || "");

  useEffect(() => {
    if (blogData) {
      setSelectedCategory(
        blogData?.categories?.map((item, index) => {
          return {
            value: blogData?.categories[index],
            label: blogData?.categories_names[index],
          };
        })
      );
    }
  }, [blogData]);

  const loadOptions = async (inputText, callback) => {
    let url = `https://backendapi.trakky.in/salons/blogcategory/?name=${inputText}&city=${selectedCity}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let category = data?.results?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        callback(category);
      })
      .catch((err) => alert(err));
  };

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getCity();
  }, []);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    setMainImg(selectedFile);
    // You can perform additional validations here if needed

    // Create a FileReader instance
    const reader = new FileReader();

    // Define what happens when the file is loaded
    reader.onloadend = () => {
      // After the file is loaded, set the image to the reader result
      setImage(reader.result);
    };

    if (selectedFile) {
      // Read the file as a data URL
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleHashtagsChange = (e) => {
    const { value } = e.target;
    setHashtags(value.split(","));
  };

  // Function to convert the image to a valid JPEG or PNG format
  const convertToValidFormat = async (blob) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg"); // Change format here to 'image/png' for PNG format
      };

      const url = URL.createObjectURL(blob);
      img.src = url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    const content = editorRef.current.getContents();
    const ops = content.ops;
    const imageOps = ops.filter((op) => op.insert && op.insert.image); // Extract image operations

    if (imageOps.length > 0) {
      const promises = imageOps.map(async (imageOp) => {
        const imageUrl = imageOp.insert.image; // Extract image URL from the content

        // Check if the image URL has already been updated
        if (
          !imageUrl.startsWith(
            "https://res.cloudinary.com/dvjozqf7u/image/upload/"
          )
        ) {
          try {
            const res = await fetch(imageUrl); // Fetch the image data
            const blob = await res.blob(); // Convert image data to Blob format

            // Convert the image to a valid format (JPEG or PNG)
            const validImageData = await convertToValidFormat(blob);

            const formData = new FormData();
            formData.append("uploaded_images", validImageData, "image.jpg"); // Adjust filename and extension

            const uploadRes = await fetch(
              `https://backendapi.trakky.in/salons/blogs/images/`,
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + String(authTokens.access),
                },
                body: formData,
              }
            );

            const { url: newImageUrl, id } = await uploadRes.json();

            // Replace the image URL in the content with the uploaded image URL from API response
            const updatedOps = content.ops.map((op) => {
              if (op.insert && op.insert.image === imageUrl) {
                op.insert.image = newImageUrl; // Replace the image URL directly from the API response
              }
              return op;
            });
            const updatedContent = { ops: updatedOps };
            editorRef.current.setContents(updatedContent); // Update the editor content with the new image URL
            // cursor will be at the end of the editor after updating the content
            editorRef.current.setSelection(updatedContent.length, 0);

            form.append("blog_images", id); // Add the image ID to the form data
          } catch (error) {
            console.error("Error uploading image:", error);
            // Handle the error accordingly, e.g., show a notification to the user
          }
        }
      });

      await Promise.all(promises); // Wait for all image uploads to complete
    }
    // Create a blog object with form data
    form.append("title", title);
    form.append("author", author);
    form.append("date", date);
    form.append("meta_title", metaTitle);
    form.append("meta_description", metaDescription);
    form.append("meta_keywords", metaKeywords);
    form.append("slug", slug);
    form.append("read_time", readTime);
    if (mainImg) {
      form.append("image_blog", mainImg);
    }
    form.append("content", editorRef.current.root.innerHTML);
    form.append("city", selectedCity);
    hashtags?.forEach((tag) => {
      form.append("hashtags", tag);
    });
    selectedCategory.forEach((category) => {
      form.append("categories", category.value);
    });

    try {
      if (!blogData) {
        const res = await fetch(`https://backendapi.trakky.in/salons/blogs/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: form,
        });
        const data = await res.json();

        if (res.status === 403) {
          alert("Something went wrong");
          return;
        }

        alert("Blog created successfully");
        // Clear the form
        setTitle("");
        setAuthor("");
        setDate("");
        setMetaTitle("");
        setMetaDescription("");
        setMetaKeywords("");
        setSlug("");
        setHashtags("");
        setImage(null);
        setMainImg(null);
        setSelectedCity("");
        setReadTime("");
        setSelectedCategory([]);
        editorRef.current.root.innerHTML = "";
      } else {
        const res = await fetch(
          `https://backendapi.trakky.in/salons/blogs/${blogData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: form,
          }
        );
        const data = await res.json();

        if (res.status === 403) {
          alert("Something went wrong");
          return;
        }

        alert("Blog updated successfully");
        // Clear the form
        setTitle("");
        setAuthor("");
        setDate("");
        setMetaTitle("");
        setMetaDescription("");
        setMetaKeywords("");
        setSlug("");
        setHashtags("");
        setImage(null);
        setMainImg(null);
        setReadTime("");
        setSelectedCity("");
        setSelectedCategory([]);
        editorRef.current.root.innerHTML = "";
        await closeModal();

        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      // Handle the error accordingly, e.g., show a notification to the user
    }
  };

  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["image"],
          ["blockquote", "code-block"],
          ["link"],
        ],
      },
    });

    if (blogData) {
      editorRef.current.root.innerHTML = blogData.content;
    }

    const handleTextChange = () => {
      updateReadTime(editorRef.current);
    };

    editorRef.current.on("text-change", handleTextChange);

    return () => {
      editorRef.current.off("text-change", handleTextChange);
    };
  }, []);

  function calculateReadTime(content) {
    const wordsPerMinute = 200;

    const wordCount = content.split(/\s+/).length;

    const readTimeMinutes = wordCount / wordsPerMinute;

    const readTime = Math.round(readTimeMinutes);

    return readTime;
  }

  function updateReadTime(editor) {
    const content = editor.getText();
    const readTime = calculateReadTime(content);
    setReadTime(readTime);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <h3 className="form-title">Create Blog</h3>
        </div>
        {image && (
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="image">
                Main Image
              </label>
              <img
                src={image}
                alt="Main"
                style={{
                  width: "50%",
                  height: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="image">Main Image<span className="Note_Inp_Classs">Recommended Image Ratio 3:1</span></label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*" // Limit to image files
              onChange={handleImageChange} // Triggered when a new file is selected
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="content">Content</label>
            <div id="editor" style={{ width: "100%", height: "250px" }}></div>
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Author.."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="input-box inp-name col-2">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              placeholder="Date.."
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="metaTitle">Meta Title</label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              placeholder="Meta Title.."
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div className="input-box inp-name col-2">
            <label htmlFor="metaDescription">Meta Description</label>
            <textarea
              type="text"
              id="metaDescription"
              name="metaDescription"
              placeholder="Meta Description.."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="metaKeywords">Meta Keywords</label>
            <input
              type="text"
              id="metaKeywords"
              name="metaKeywords"
              placeholder="Meta Keywords.."
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />
          </div>
          <div className="input-box inp-name col-2">
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              placeholder="Slug.."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="id">Select City</label>
            <select
              name="id"
              id="id"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
              required
            >
              <option value="">Select City</option>
              {city.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box inp-name col-2">
            <label htmlFor="id">Select Category</label>
            <Select
              isDisabled={selectedCity === ""}
              isMulti={true}
              name="id"
              id="id"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(
                  e
                    ? e.map((item) => {
                      return {
                        value: item.value,
                        label: item.label,
                      };
                    })
                    : []
                );
              }}
              required
              loadOptions={loadOptions}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="hashtags">Hashtags</label>
            <input
              type="text"
              id="hashtags"
              name="hashtags"
              placeholder="Hashtags.."
              value={hashtags}
              onChange={handleHashtagsChange}
            />
          </div>
          <div className="input-box inp-name col-2">
            <p>
              Note: Separate hashtags with commas. Example: #tag1, #tag2, #tag3
            </p>
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1">
            <label htmlFor="readtime">Read Time</label>
            <input
              type="number"
              id="readtime"
              min={0}
              name="readtime"
              placeholder="Enter Read Time.."
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                }
              }}
            />
          </div>
          <div className="input-box inp-name col-2">
            <p>
              Note: Enter read time in minutes. Example: 5 for 5 minutes read
            </p>
          </div>
        </div>
        <div className="submit-btn row">
          <button type="submit">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogs;
