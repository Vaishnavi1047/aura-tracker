import { createSupabaseClient } from "../utils/supabase";
import jwt from "jsonwebtoken";

export async function getAttendanceDates(req: any, res: any) {
  // console.log("came here");
  const user = req.user;
  const id = user.id;
  const token = jwt.sign({ id }, process.env.SUPABASE_JWT_SECRET!, {
    expiresIn: "10m",
  });
  const supabase = createSupabaseClient(token);

  const { data, error } = await supabase.rpc("get_unique_attendance_dates", {
    prof_id: id,
  });

  // console.log(data);
  if (error) {
    console.error(error);
    return res.status(500).send({ message: "couldn't get attendance dates" });
  }
  return res.status(200).send(data);
}

export async function getAttendanceForDate(req: any, res: any) {
  // console.log(req.query);
  const { date, course_id } = req.query;
  if (!date || !course_id) {
    return res.status(400).send({ message: "send date and course id" });
  }
  const user = req.user;
  const id = user.id;
  const token = jwt.sign({ id }, process.env.SUPABASE_JWT_SECRET!, {
    expiresIn: "10m",
  });
  const supabase = createSupabaseClient(token);
  const { data, error } = await supabase.rpc("get_attendance_by_date_course", {
    p_date: date,
    p_course_id: course_id,
  });

  if (error) {
    console.error(error);
    return res.status(500).send({ message: "couldn't get attendance dates" });
  }
  return res.status(200).send(data);
}

export async function updateAttendance(req: any, res: any) {
  // console.log(req.body);
  // res.send({ message: "hi" });

  if (!req.body) {
    return res.status(400).send({ message: "Please send the attendance data" });
  }

  const user = req.user;
  const id = user.id;
  const token = jwt.sign({ id }, process.env.SUPABASE_JWT_SECRET!, {
    expiresIn: "10m",
  });
  const supabase = createSupabaseClient(token);
  let errorWhileUpdating = false;
  const date = req.body.date;
  req.body.attendanceRecords.forEach(async (record: any) => {
    const { error } = await supabase
      .from("attendance")
      .update({ status: record.status })
      .eq("enrollment_id", record.enrollment_id)
      .eq("date", date);
    if (error && !errorWhileUpdating) {
      errorWhileUpdating = true;
    }
  });
  if (errorWhileUpdating) {
    return res
      .status(200)
      .send({ message: "Some records couldn't be updated! Contact admin" });
  }
  return res.status(200).send({ message: "Success!" });
}