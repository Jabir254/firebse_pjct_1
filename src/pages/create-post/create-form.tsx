import { useForm } from "react-hook-form";
import * as yup from "yup";

export const CreateForm = () => {
    const schema = yup.object().shape({
        title: yup.string().required("You Must add a title"),
        description: yup.string().required('You Must add a description'),
        
    })
  return (
    <form>
      <input placeholder="Title..." />
      <textarea placeholder="Description..." />
      <input type="submit" />
    </form>
  );
};
