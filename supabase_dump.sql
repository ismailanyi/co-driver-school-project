--
-- PostgreSQL database dump
--

\restrict ssSn8MtoVtUpfUUHtHs6Pxcb3PSzQqGVZWMGqAotgkHc3r4ew4pWmsX6Xr8fUmo

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: auth_provider_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.auth_provider_type AS ENUM (
    'phone',
    'email',
    'google',
    'apple',
    'facebook'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: road_signs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.road_signs (
    id integer NOT NULL,
    display_name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    category character varying(255) NOT NULL
);


--
-- Name: theory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.theory (
    id integer NOT NULL,
    category text,
    question text,
    correct_ans text[],
    wrong_ans text[],
    hint text
);


--
-- Name: category_question_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.category_question_counts AS
 SELECT 'theory'::text AS question_type,
    theory.category,
    count(*) AS total_questions
   FROM public.theory
  GROUP BY theory.category
UNION ALL
 SELECT 'sign'::text AS question_type,
    road_signs.category,
    count(*) AS total_questions
   FROM public.road_signs
  GROUP BY road_signs.category;


--
-- Name: intake_periods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intake_periods (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: intake_periods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.intake_periods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intake_periods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intake_periods_id_seq OWNED BY public.intake_periods.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    phone_number character varying(20),
    email character varying(255),
    password_hash character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    provider public.auth_provider_type DEFAULT 'phone'::public.auth_provider_type,
    provider_id character varying(255),
    role character varying(50) DEFAULT 'student'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reset_token character varying(255),
    reset_token_expires timestamp with time zone,
    theory_progress integer DEFAULT 1,
    road_signs_progress integer DEFAULT 1,
    school_code character varying(255) DEFAULT NULL::character varying,
    total_xp integer DEFAULT 0 NOT NULL,
    requires_password_change boolean DEFAULT false,
    intake character varying(100),
    streak_count integer DEFAULT 0,
    last_login date,
    hearts integer DEFAULT 5,
    last_heart_refill timestamp without time zone DEFAULT now(),
    course_progress jsonb,
    profile_picture text,
    last_lesson_date timestamp without time zone,
    username character varying(50),
    age integer
);


--
-- Name: leaderboard_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.leaderboard_view AS
 SELECT id,
    first_name,
    last_name,
    profile_picture,
    total_xp
   FROM public.users
  WHERE ((role)::text = 'student'::text)
  ORDER BY total_xp DESC;


--
-- Name: question_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_attempts (
    id integer NOT NULL,
    user_id uuid,
    question_id integer NOT NULL,
    quiz_type character varying(20) NOT NULL,
    is_correct boolean NOT NULL,
    time_taken_seconds integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: question_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_attempts_id_seq OWNED BY public.question_attempts.id;


--
-- Name: question_suggestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_suggestions (
    id integer NOT NULL,
    suggested_by uuid,
    question_type character varying(20) NOT NULL,
    action character varying(10) NOT NULL,
    category character varying(255) NOT NULL,
    question_text text,
    correct_ans text,
    wrong_ans_1 text,
    wrong_ans_2 text,
    wrong_ans_3 text,
    hint text,
    existing_question_id integer,
    notes text,
    status character varying(20) DEFAULT 'pending'::character varying,
    admin_notes text,
    created_at timestamp without time zone DEFAULT now(),
    reviewed_at timestamp without time zone,
    reviewed_by uuid,
    image_url character varying(255)
);


--
-- Name: question_suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.question_suggestions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: question_suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.question_suggestions_id_seq OWNED BY public.question_suggestions.id;


--
-- Name: quiz_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_results (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    quiz_type character varying(20) NOT NULL,
    category character varying(255) NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    total_questions integer DEFAULT 0 NOT NULL,
    time_seconds integer,
    xp_earned integer DEFAULT 0 NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: quiz_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quiz_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quiz_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quiz_results_id_seq OWNED BY public.quiz_results.id;


--
-- Name: road_signs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.road_signs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: road_signs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.road_signs_id_seq OWNED BY public.road_signs.id;


--
-- Name: road_signs_lessons; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.road_signs_lessons AS
 SELECT row_number() OVER (ORDER BY category) AS id,
    category
   FROM ( SELECT DISTINCT road_signs.category
           FROM public.road_signs) subquery;


--
-- Name: system_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_feedback (
    id integer NOT NULL,
    user_id uuid,
    category character varying(50) NOT NULL,
    message text NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying,
    admin_notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    subject character varying(255),
    attachment_url text
);


--
-- Name: system_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_feedback_id_seq OWNED BY public.system_feedback.id;


--
-- Name: theory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.theory ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.theory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: theory_lessons; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.theory_lessons AS
 SELECT row_number() OVER (ORDER BY category) AS id,
    category
   FROM ( SELECT DISTINCT theory.category
           FROM public.theory) subquery;


--
-- Name: intake_periods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intake_periods ALTER COLUMN id SET DEFAULT nextval('public.intake_periods_id_seq'::regclass);


--
-- Name: question_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_attempts ALTER COLUMN id SET DEFAULT nextval('public.question_attempts_id_seq'::regclass);


--
-- Name: question_suggestions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_suggestions ALTER COLUMN id SET DEFAULT nextval('public.question_suggestions_id_seq'::regclass);


--
-- Name: quiz_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_results ALTER COLUMN id SET DEFAULT nextval('public.quiz_results_id_seq'::regclass);


--
-- Name: road_signs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.road_signs ALTER COLUMN id SET DEFAULT nextval('public.road_signs_id_seq'::regclass);


--
-- Name: system_feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_feedback ALTER COLUMN id SET DEFAULT nextval('public.system_feedback_id_seq'::regclass);


--
-- Data for Name: intake_periods; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: question_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.question_attempts VALUES (1, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 138, 'theory', true, 2, '2026-06-15 14:02:42.454697');
INSERT INTO public.question_attempts VALUES (2, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 138, 'theory', true, 3, '2026-06-15 15:10:04.491003');
INSERT INTO public.question_attempts VALUES (3, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 20, 'theory', false, 3, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (4, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 21, 'theory', true, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (5, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 22, 'theory', false, 3, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (6, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 23, 'theory', true, 3, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (7, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 24, 'theory', false, 3, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (8, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 25, 'theory', false, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (9, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 26, 'theory', false, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (10, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 27, 'theory', true, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (11, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 28, 'theory', false, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (12, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 29, 'theory', false, 2, '2026-06-15 15:10:41.00036');
INSERT INTO public.question_attempts VALUES (13, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 138, 'theory', true, 18, '2026-06-15 20:32:36.094954');
INSERT INTO public.question_attempts VALUES (14, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 180, 'sign', true, 4, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (15, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 181, 'sign', true, 7, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (16, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 182, 'sign', true, 10, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (17, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 183, 'sign', true, 8, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (18, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 184, 'sign', true, 5, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (19, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 185, 'sign', true, 17, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (20, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 186, 'sign', true, 5, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (21, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 187, 'sign', true, 5, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (22, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 188, 'sign', true, 16, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (23, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 189, 'sign', false, 4, '2026-06-15 20:42:45.408708');
INSERT INTO public.question_attempts VALUES (24, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 138, 'theory', true, 3, '2026-06-15 21:57:17.517012');
INSERT INTO public.question_attempts VALUES (25, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 20, 'theory', true, 2, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (26, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 21, 'theory', true, 3, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (27, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 22, 'theory', true, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (28, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 23, 'theory', true, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (29, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 24, 'theory', false, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (30, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 25, 'theory', true, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (31, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 26, 'theory', false, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (32, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 27, 'theory', true, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (33, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 28, 'theory', false, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (34, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 29, 'theory', false, 1, '2026-06-15 21:57:44.129211');
INSERT INTO public.question_attempts VALUES (35, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 20, 'theory', true, 2, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (36, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 21, 'theory', true, 3, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (37, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 22, 'theory', true, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (38, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 23, 'theory', true, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (39, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 24, 'theory', false, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (40, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 25, 'theory', true, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (41, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 26, 'theory', false, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (42, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 27, 'theory', true, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (43, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 28, 'theory', false, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (44, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 29, 'theory', false, 1, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (45, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 29, 'theory', false, 11, '2026-06-15 21:57:54.358691');
INSERT INTO public.question_attempts VALUES (46, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 36, 'theory', false, 4, '2026-06-15 22:34:46.420845');
INSERT INTO public.question_attempts VALUES (47, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 37, 'theory', true, 2, '2026-06-15 22:34:46.420845');
INSERT INTO public.question_attempts VALUES (48, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 38, 'theory', true, 3, '2026-06-15 22:34:46.420845');
INSERT INTO public.question_attempts VALUES (49, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 39, 'theory', false, 154, '2026-06-15 22:34:46.420845');
INSERT INTO public.question_attempts VALUES (50, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 40, 'theory', true, 2, '2026-06-15 22:34:46.420845');
INSERT INTO public.question_attempts VALUES (51, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 51, 'theory', false, 9, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (52, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 52, 'theory', true, 2, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (53, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 53, 'theory', false, 4, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (54, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 54, 'theory', false, 7, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (55, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 55, 'theory', false, 8, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (56, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 56, 'theory', true, 8, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (57, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 57, 'theory', true, 5, '2026-06-15 22:35:52.385351');
INSERT INTO public.question_attempts VALUES (58, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1014, 'sign', true, 3, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (59, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1015, 'sign', true, 5, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (60, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1016, 'sign', false, 2, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (61, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1017, 'sign', true, 30, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (62, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1018, 'sign', true, 5, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (63, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1019, 'sign', true, 1, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (64, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1020, 'sign', true, 3, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (65, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1021, 'sign', true, 1, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (66, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1022, 'sign', true, 2, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (67, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 1023, 'sign', false, 2, '2026-06-15 22:50:56.723152');
INSERT INTO public.question_attempts VALUES (68, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 138, 'theory', false, 3, '2026-06-29 14:26:11.246875');
INSERT INTO public.question_attempts VALUES (69, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 20, 'theory', true, 6, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (70, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 21, 'theory', false, 8, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (71, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 22, 'theory', true, 11, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (72, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 23, 'theory', true, 2, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (73, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 24, 'theory', true, 50, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (74, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 25, 'theory', false, 5, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (75, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 26, 'theory', true, 1, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (76, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 27, 'theory', false, 1, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (77, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 28, 'theory', false, 2, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (78, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 29, 'theory', true, 3, '2026-06-29 14:27:57.851758');
INSERT INTO public.question_attempts VALUES (79, 'd88a3730-501d-450f-bbc0-e4828ba25497', 138, 'theory', false, 5, '2026-06-30 12:48:09.805691');
INSERT INTO public.question_attempts VALUES (80, 'd88a3730-501d-450f-bbc0-e4828ba25497', 138, 'theory', true, 14, '2026-07-02 13:09:19.462307');
INSERT INTO public.question_attempts VALUES (81, 'd88a3730-501d-450f-bbc0-e4828ba25497', 20, 'theory', true, 7, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (82, 'd88a3730-501d-450f-bbc0-e4828ba25497', 21, 'theory', true, 17, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (83, 'd88a3730-501d-450f-bbc0-e4828ba25497', 22, 'theory', true, 26, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (84, 'd88a3730-501d-450f-bbc0-e4828ba25497', 23, 'theory', true, 33, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (85, 'd88a3730-501d-450f-bbc0-e4828ba25497', 24, 'theory', true, 11, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (86, 'd88a3730-501d-450f-bbc0-e4828ba25497', 25, 'theory', true, 13, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (87, 'd88a3730-501d-450f-bbc0-e4828ba25497', 26, 'theory', false, 13, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (88, 'd88a3730-501d-450f-bbc0-e4828ba25497', 27, 'theory', false, 184, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (89, 'd88a3730-501d-450f-bbc0-e4828ba25497', 28, 'theory', true, 53, '2026-07-02 13:48:57.539683');
INSERT INTO public.question_attempts VALUES (90, 'd88a3730-501d-450f-bbc0-e4828ba25497', 29, 'theory', true, 15, '2026-07-02 13:48:57.539683');


--
-- Data for Name: question_suggestions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.question_suggestions VALUES (1, 'ea6a1374-e277-43d5-9c0f-d6ca3ce69a52', 'theory', 'add', 'arfq', 'wwEDQWRE', '', '', '', '', '', NULL, '', 'pending', NULL, '2026-07-02 13:15:01.567828', NULL, NULL, NULL);


--
-- Data for Name: quiz_results; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quiz_results VALUES (14, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'theory', 'Lighting and Signals', 2, 5, 6, 20, '2026-06-14 19:40:44.283789');
INSERT INTO public.quiz_results VALUES (15, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'theory', 'Accidents and Emergencies', 1, 1, 154, 10, '2026-06-15 13:04:34.944232');
INSERT INTO public.quiz_results VALUES (16, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'theory', 'Basic Road Rules', 2, 5, 25, 20, '2026-06-15 13:05:10.588223');
INSERT INTO public.quiz_results VALUES (17, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'theory', 'Accidents and Emergencies', 1, 1, 2, 10, '2026-06-15 14:02:42.454697');
INSERT INTO public.quiz_results VALUES (18, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'theory', 'Accidents and Emergencies', 1, 1, 4, 5, '2026-06-15 15:10:04.491003');
INSERT INTO public.quiz_results VALUES (19, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:05.109695');
INSERT INTO public.quiz_results VALUES (20, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:05.117032');
INSERT INTO public.quiz_results VALUES (21, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:11.6432');
INSERT INTO public.quiz_results VALUES (22, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:11.65727');
INSERT INTO public.quiz_results VALUES (23, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'theory', 'Basic Road Rules', 3, 10, 30, 30, '2026-06-15 15:10:41.00036');
INSERT INTO public.quiz_results VALUES (24, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:41.826171');
INSERT INTO public.quiz_results VALUES (25, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:41.873946');
INSERT INTO public.quiz_results VALUES (26, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:41.916599');
INSERT INTO public.quiz_results VALUES (27, '3b8ca6d2-6221-4863-87d7-766ede7a5cb9', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 15:10:41.931359');
INSERT INTO public.quiz_results VALUES (28, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'theory', 'Accidents and Emergencies', 1, 1, 19, 10, '2026-06-15 20:32:36.094954');
INSERT INTO public.quiz_results VALUES (29, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:32:39.573453');
INSERT INTO public.quiz_results VALUES (30, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:32:39.580591');
INSERT INTO public.quiz_results VALUES (31, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:39:33.843203');
INSERT INTO public.quiz_results VALUES (32, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:39:33.846723');
INSERT INTO public.quiz_results VALUES (33, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'sign', 'information', 9, 10, 93, 90, '2026-06-15 20:42:45.408708');
INSERT INTO public.quiz_results VALUES (34, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:42:57.889655');
INSERT INTO public.quiz_results VALUES (35, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:42:57.889508');
INSERT INTO public.quiz_results VALUES (36, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:42:57.890874');
INSERT INTO public.quiz_results VALUES (37, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 20:42:57.891672');
INSERT INTO public.quiz_results VALUES (38, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'theory', 'Accidents and Emergencies', 1, 1, 3, 10, '2026-06-15 21:57:17.517012');
INSERT INTO public.quiz_results VALUES (39, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:23.462809');
INSERT INTO public.quiz_results VALUES (40, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:23.47073');
INSERT INTO public.quiz_results VALUES (41, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:27.548777');
INSERT INTO public.quiz_results VALUES (42, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:27.554968');
INSERT INTO public.quiz_results VALUES (43, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'theory', 'Basic Road Rules', 6, 10, 17, 60, '2026-06-15 21:57:44.129211');
INSERT INTO public.quiz_results VALUES (44, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:44.383483');
INSERT INTO public.quiz_results VALUES (45, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:44.384026');
INSERT INTO public.quiz_results VALUES (46, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:44.390393');
INSERT INTO public.quiz_results VALUES (47, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:44.390525');
INSERT INTO public.quiz_results VALUES (48, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:53.337185');
INSERT INTO public.quiz_results VALUES (49, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 21:57:53.338131');
INSERT INTO public.quiz_results VALUES (51, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'theory', 'Basic Road Rules', 3, 5, 499, 30, '2026-06-15 22:34:46.420845');
INSERT INTO public.quiz_results VALUES (52, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:34:47.888371');
INSERT INTO public.quiz_results VALUES (53, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:34:47.899851');
INSERT INTO public.quiz_results VALUES (54, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:34:57.368288');
INSERT INTO public.quiz_results VALUES (55, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:34:57.372252');
INSERT INTO public.quiz_results VALUES (56, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'theory', 'Documents and Licensing', 3, 7, 55, 30, '2026-06-15 22:35:52.385351');
INSERT INTO public.quiz_results VALUES (57, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:35:54.159695');
INSERT INTO public.quiz_results VALUES (58, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:35:54.166277');
INSERT INTO public.quiz_results VALUES (59, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:35:54.166448');
INSERT INTO public.quiz_results VALUES (60, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:35:54.167665');
INSERT INTO public.quiz_results VALUES (61, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'sign', 'warning', 8, 10, 58, 80, '2026-06-15 22:50:56.723152');
INSERT INTO public.quiz_results VALUES (62, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:50:57.019375');
INSERT INTO public.quiz_results VALUES (63, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'rs', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:50:57.019878');
INSERT INTO public.quiz_results VALUES (64, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:53:02.633524');
INSERT INTO public.quiz_results VALUES (65, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-15 22:53:02.637555');
INSERT INTO public.quiz_results VALUES (66, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'theory', 'Accidents and Emergencies', 0, 1, 4, 0, '2026-06-29 14:26:11.246875');
INSERT INTO public.quiz_results VALUES (67, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:26:12.177071');
INSERT INTO public.quiz_results VALUES (68, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:26:12.179954');
INSERT INTO public.quiz_results VALUES (69, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:26:20.974027');
INSERT INTO public.quiz_results VALUES (70, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:26:20.996103');
INSERT INTO public.quiz_results VALUES (71, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'theory', 'Basic Road Rules', 6, 10, 97, 60, '2026-06-29 14:27:57.851758');
INSERT INTO public.quiz_results VALUES (72, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:27:58.251632');
INSERT INTO public.quiz_results VALUES (73, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:27:58.265509');
INSERT INTO public.quiz_results VALUES (74, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:27:58.27995');
INSERT INTO public.quiz_results VALUES (75, '0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-29 14:27:58.280141');
INSERT INTO public.quiz_results VALUES (76, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'theory', 'Accidents and Emergencies', 0, 1, 6, 0, '2026-06-30 12:48:09.805691');
INSERT INTO public.quiz_results VALUES (77, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-30 12:48:11.126296');
INSERT INTO public.quiz_results VALUES (78, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-30 12:48:11.131866');
INSERT INTO public.quiz_results VALUES (79, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-30 12:48:18.63618');
INSERT INTO public.quiz_results VALUES (80, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-06-30 12:48:18.647049');
INSERT INTO public.quiz_results VALUES (81, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'theory', 'Accidents and Emergencies', 1, 1, 14, 10, '2026-07-02 13:09:19.462307');
INSERT INTO public.quiz_results VALUES (82, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:09:20.638682');
INSERT INTO public.quiz_results VALUES (83, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:09:20.642947');
INSERT INTO public.quiz_results VALUES (84, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:09:30.998246');
INSERT INTO public.quiz_results VALUES (85, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:09:31.007799');
INSERT INTO public.quiz_results VALUES (86, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'theory', 'Basic Road Rules', 8, 10, 529, 80, '2026-07-02 13:48:57.539683');
INSERT INTO public.quiz_results VALUES (87, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:48:58.84111');
INSERT INTO public.quiz_results VALUES (88, 'd88a3730-501d-450f-bbc0-e4828ba25497', 'th', 'lesson', 0, 0, NULL, 0, '2026-07-02 13:48:58.845998');


--
-- Data for Name: road_signs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.road_signs VALUES (1, 'Accident area', 'complementary--accident-area--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (2, 'Accident area', 'complementary--accident-area--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (3, 'Accident area', 'complementary--accident-area--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (4, 'Accident area', 'complementary--accident-area--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (5, 'Advisory exit or ramp speed', 'complementary--advisory-exit-or-ramp-speed--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (6, 'Bicycles', 'complementary--bicycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (7, 'Bicycles and pedestrians detour', 'complementary--bicycles-and-pedestrians-detour--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (8, 'Bicycles or pedestrians detour', 'complementary--bicycles-or-pedestrians-detour--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (9, 'Bicycles turn right', 'complementary--bicycles-turn-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (10, 'Bike route', 'complementary--bike-route--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (11, 'Bike route', 'complementary--bike-route--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (12, 'Both directions', 'complementary--both-directions--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (13, 'Both directions', 'complementary--both-directions--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (14, 'Buses', 'complementary--buses--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (15, 'Buses and trucks', 'complementary--buses-and-trucks--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (16, 'Camera', 'complementary--camera--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (17, 'Camera', 'complementary--camera--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (18, 'Camera', 'complementary--camera--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (19, 'Camera', 'complementary--camera--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (20, 'Camera', 'complementary--camera--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (21, 'Caravan trailers', 'complementary--caravan-trailers--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (22, 'Caravan trailers', 'complementary--caravan-trailers--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (23, 'Caravans', 'complementary--caravans--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (24, 'Carts', 'complementary--carts--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (25, 'Chevron left', 'complementary--chevron-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (26, 'Chevron left', 'complementary--chevron-left--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (27, 'Chevron left', 'complementary--chevron-left--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (28, 'Chevron left', 'complementary--chevron-left--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (29, 'Chevron left', 'complementary--chevron-left--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (30, 'Chevron right', 'complementary--chevron-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (31, 'Chevron right', 'complementary--chevron-right--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (32, 'Chevron right', 'complementary--chevron-right--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (33, 'Chevron right', 'complementary--chevron-right--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (34, 'Chevron right', 'complementary--chevron-right--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (35, 'Dangerous or pollutant good', 'complementary--dangerous-or-pollutant-good--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (36, 'Dead end', 'complementary--dead-end--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (37, 'Detour', 'complementary--detour--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (38, 'Disabled persons', 'complementary--disabled-persons--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (39, 'Distance', 'complementary--distance--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (40, 'Distance', 'complementary--distance--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (41, 'Distance', 'complementary--distance--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (42, 'End of road works', 'complementary--end-of-road-works--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (43, 'Except bicycles', 'complementary--except-bicycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (44, 'Except bicycles', 'complementary--except-bicycles--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (45, 'Except buses', 'complementary--except-buses--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (46, 'Except carts', 'complementary--except-carts--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (47, 'Except motorcycles', 'complementary--except-motorcycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (48, 'Except motorcycles', 'complementary--except-motorcycles--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (49, 'Except polluting level green', 'complementary--except-polluting-level-green--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (50, 'Except polluting level green yellow', 'complementary--except-polluting-level-green-yellow--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (51, 'Except polluting level green yellow red', 'complementary--except-polluting-level-green-yellow-red--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (52, 'Except tractors', 'complementary--except-tractors--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (53, 'Except tractors', 'complementary--except-tractors--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (54, 'Except trailers', 'complementary--except-trailers--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (55, 'Except trailers', 'complementary--except-trailers--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (56, 'Except trains', 'complementary--except-trains--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (57, 'Except trams', 'complementary--except-trams--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (58, 'Except trucks', 'complementary--except-trucks--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (59, 'Except vehicles', 'complementary--except-vehicles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (60, 'Except vehicles', 'complementary--except-vehicles--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (61, 'Go left', 'complementary--go-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (62, 'Go right', 'complementary--go-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (63, 'Go straight or turn left', 'complementary--go-straight-or-turn-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (64, 'Go straight or turn right', 'complementary--go-straight-or-turn-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (65, 'Height limit', 'complementary--height-limit--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (66, 'Height limit', 'complementary--height-limit--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (67, 'Including bicycles and motorcycles', 'complementary--including-bicycles-and-motorcycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (68, 'Including buses vehicles', 'complementary--including-buses-vehicles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (69, 'Keep left', 'complementary--keep-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (70, 'Keep right', 'complementary--keep-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (71, 'Lane control', 'complementary--lane-control--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (72, 'Lane control', 'complementary--lane-control--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (73, 'Lane control', 'complementary--lane-control--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (74, 'Maximum speed limit 10', 'complementary--maximum-speed-limit-10--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (75, 'Maximum speed limit 15', 'complementary--maximum-speed-limit-15--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (76, 'Maximum speed limit 20', 'complementary--maximum-speed-limit-20--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (77, 'Maximum speed limit 25', 'complementary--maximum-speed-limit-25--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (78, 'Maximum speed limit 30', 'complementary--maximum-speed-limit-30--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (79, 'Maximum speed limit 35', 'complementary--maximum-speed-limit-35--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (80, 'Maximum speed limit 40', 'complementary--maximum-speed-limit-40--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (81, 'Maximum speed limit 45', 'complementary--maximum-speed-limit-45--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (82, 'Maximum speed limit 50', 'complementary--maximum-speed-limit-50--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (83, 'Maximum speed limit 55', 'complementary--maximum-speed-limit-55--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (84, 'Maximum speed limit 60', 'complementary--maximum-speed-limit-60--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (85, 'Maximum speed limit 65', 'complementary--maximum-speed-limit-65--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (86, 'Maximum speed limit 70', 'complementary--maximum-speed-limit-70--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (87, 'Maximum speed limit 75', 'complementary--maximum-speed-limit-75--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (88, 'Maximum speed limit 80', 'complementary--maximum-speed-limit-80--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (89, 'Maximum speed limit 85', 'complementary--maximum-speed-limit-85--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (90, 'Maximum speed limit 90', 'complementary--maximum-speed-limit-90--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (91, 'Maximum speed limit 95', 'complementary--maximum-speed-limit-95--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (92, 'Motorcycles', 'complementary--motorcycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (93, 'Motorcycles', 'complementary--motorcycles--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (94, 'Motorcycles', 'complementary--motorcycles--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (95, 'Motorcycles', 'complementary--motorcycles--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (96, 'Obstacle delineator', 'complementary--obstacle-delineator--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (97, 'Obstacle delineator', 'complementary--obstacle-delineator--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (98, 'Obstacle delineator', 'complementary--obstacle-delineator--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (99, 'One direction left', 'complementary--one-direction-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (100, 'One direction right', 'complementary--one-direction-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (101, 'Pass left', 'complementary--pass-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (102, 'Pass right', 'complementary--pass-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (103, 'Pedestrians and bicycles', 'complementary--pedestrians-and-bicycles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (104, 'Pedestrians left', 'complementary--pedestrians-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (105, 'Pedestrians right', 'complementary--pedestrians-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (106, 'Photo enforced', 'complementary--photo-enforced--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (107, 'Playground', 'complementary--playground--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (108, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (109, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (110, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (111, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (112, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (113, 'Priority route at intersection', 'complementary--priority-route-at-intersection--g6.svg', 'complementary');
INSERT INTO public.road_signs VALUES (114, 'Railroad', 'complementary--railroad--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (115, 'Railroad', 'complementary--railroad--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (116, 'Railroad', 'complementary--railroad--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (117, 'Restriction in both directions', 'complementary--restriction-in-both-directions--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (118, 'Roundabout go left', 'complementary--roundabout-go-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (119, 'Roundabout go right', 'complementary--roundabout-go-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (120, 'Roundabout go straight', 'complementary--roundabout-go-straight--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (121, 'Slippery for caravan trailers', 'complementary--slippery-for-caravan-trailers--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (122, 'Snow', 'complementary--snow--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (123, 'Snow', 'complementary--snow--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (124, 'Snow', 'complementary--snow--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (125, 'Snowmobiles', 'complementary--snowmobiles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (126, 'Soft shoulder', 'complementary--soft-shoulder--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (127, 'Soft shoulder', 'complementary--soft-shoulder--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (128, 'Steep ascent', 'complementary--steep-ascent--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (129, 'Steep descent', 'complementary--steep-descent--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (130, 'Time restrictions', 'complementary--time-restrictions--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (131, 'Time restrictions', 'complementary--time-restrictions--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (132, 'Tow away zone', 'complementary--tow-away-zone--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (133, 'Tow away zone', 'complementary--tow-away-zone--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (134, 'Tractors', 'complementary--tractors--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (135, 'Traffic queues', 'complementary--traffic-queues--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (136, 'Trailers', 'complementary--trailers--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (137, 'Trailers', 'complementary--trailers--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (138, 'Trailers', 'complementary--trailers--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (139, 'Trailers', 'complementary--trailers--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (140, 'Trains', 'complementary--trains--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (141, 'Trams', 'complementary--trams--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (142, 'Trees', 'complementary--trees--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (143, 'Trucks', 'complementary--trucks--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (144, 'Trucks', 'complementary--trucks--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (145, 'Trucks', 'complementary--trucks--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (146, 'Trucks and trailers', 'complementary--trucks-and-trailers--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (147, 'Trucks buses trailers', 'complementary--trucks-buses-trailers--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (148, 'Trucks go left', 'complementary--trucks-go-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (149, 'Trucks go left ahead', 'complementary--trucks-go-left-ahead--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (150, 'Trucks go right', 'complementary--trucks-go-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (151, 'Trucks go right ahead', 'complementary--trucks-go-right-ahead--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (152, 'Trucks go straight', 'complementary--trucks-go-straight--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (153, 'Trucks turn left', 'complementary--trucks-turn-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (154, 'Trucks turn right', 'complementary--trucks-turn-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (155, 'Turn left', 'complementary--turn-left--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (156, 'Turn left', 'complementary--turn-left--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (157, 'Turn right', 'complementary--turn-right--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (158, 'Turn right', 'complementary--turn-right--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (159, 'Two way traffic', 'complementary--two-way-traffic--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (160, 'Two way traffic', 'complementary--two-way-traffic--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (161, 'Two way traffic', 'complementary--two-way-traffic--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (162, 'Two way traffic', 'complementary--two-way-traffic--g4.svg', 'complementary');
INSERT INTO public.road_signs VALUES (163, 'Two way traffic', 'complementary--two-way-traffic--g5.svg', 'complementary');
INSERT INTO public.road_signs VALUES (164, 'Vehicles', 'complementary--vehicles--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (165, 'Vehicles', 'complementary--vehicles--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (166, 'Vehicles or buses', 'complementary--vehicles-or-buses--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (167, 'Weekends or holidays', 'complementary--weekends-or-holidays--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (168, 'Weight limit', 'complementary--weight-limit--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (169, 'When foggy', 'complementary--when-foggy--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (170, 'When rainy', 'complementary--when-rainy--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (171, 'When rainy', 'complementary--when-rainy--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (172, 'When rainy', 'complementary--when-rainy--g3.svg', 'complementary');
INSERT INTO public.road_signs VALUES (173, 'When snowy', 'complementary--when-snowy--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (174, 'When snowy', 'complementary--when-snowy--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (175, 'When snowy or rainy', 'complementary--when-snowy-or-rainy--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (176, 'When snowy or rainy', 'complementary--when-snowy-or-rainy--g2.svg', 'complementary');
INSERT INTO public.road_signs VALUES (177, 'When wet', 'complementary--when-wet--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (178, 'Width limit', 'complementary--width-limit--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (179, 'Working days', 'complementary--working-days--g1.svg', 'complementary');
INSERT INTO public.road_signs VALUES (180, 'Airport', 'information--airport--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (181, 'Airport', 'information--airport--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (182, 'Bicycle lane', 'information--bicycle-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (183, 'Bicycles both ways', 'information--bicycles-both-ways--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (184, 'Bicycles crossing', 'information--bicycles-crossing--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (185, 'Bicycles crossing', 'information--bicycles-crossing--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (186, 'Bicycles crossing', 'information--bicycles-crossing--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (187, 'Bike route', 'information--bike-route--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (188, 'Bike route', 'information--bike-route--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (189, 'Built up area', 'information--built-up-area--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (190, 'Built up area', 'information--built-up-area--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (191, 'Bus lane straight', 'information--bus-lane-straight--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (192, 'Bus stop', 'information--bus-stop--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (193, 'Bus stop', 'information--bus-stop--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (194, 'Camera', 'information--camera--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (195, 'Camera', 'information--camera--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (196, 'Camera', 'information--camera--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (197, 'Camp', 'information--camp--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (198, 'Camp', 'information--camp--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (199, 'Car pool lane', 'information--car-pool-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (200, 'Caravan parking', 'information--caravan-parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (201, 'Caravan trailer parking', 'information--caravan-trailer-parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (202, 'Cargo loading zone', 'information--cargo-loading-zone--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (203, 'Central lane', 'information--central-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (204, 'Charging station', 'information--charging-station--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (205, 'Children', 'information--children--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (206, 'Children', 'information--children--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (207, 'Children crossing', 'information--children-crossing--g5.svg', 'information');
INSERT INTO public.road_signs VALUES (208, 'Cycling two abreast permitted', 'information--cycling-two-abreast-permitted--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (209, 'Dead end', 'information--dead-end--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (210, 'Dead end', 'information--dead-end--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (211, 'Dead end', 'information--dead-end--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (212, 'Dead end', 'information--dead-end--g4.svg', 'information');
INSERT INTO public.road_signs VALUES (213, 'Dead end except bicycles', 'information--dead-end-except-bicycles--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (214, 'Dead end except bicycles and pedestrians', 'information--dead-end-except-bicycles-and-pedestrians--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (215, 'Dead end except bicycles and pedestrians', 'information--dead-end-except-bicycles-and-pedestrians--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (216, 'Dead end left', 'information--dead-end-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (217, 'Dead end left', 'information--dead-end-left--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (218, 'Dead end right', 'information--dead-end-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (219, 'Dead end right', 'information--dead-end-right--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (220, 'Dead end right', 'information--dead-end-right--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (221, 'Directions', 'information--directions--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (222, 'Disabled persons', 'information--disabled-persons--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (223, 'Disabled persons', 'information--disabled-persons--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (224, 'Disabled persons', 'information--disabled-persons--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (225, 'Emergency facility', 'information--emergency-facility--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (226, 'End of advisory maximum speed limit 20', 'information--end-of-advisory-maximum-speed-limit-20--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (227, 'End of advisory maximum speed limit 40', 'information--end-of-advisory-maximum-speed-limit-40--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (228, 'End of advisory maximum speed limit 60', 'information--end-of-advisory-maximum-speed-limit-60--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (229, 'End of advisory maximum speed limit 70', 'information--end-of-advisory-maximum-speed-limit-70--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (230, 'End of advisory maximum speed limit 80', 'information--end-of-advisory-maximum-speed-limit-80--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (231, 'End of advisory maximum speed limit 90', 'information--end-of-advisory-maximum-speed-limit-90--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (232, 'End of bicycle lane', 'information--end-of-bicycle-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (233, 'End of built up area', 'information--end-of-built-up-area--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (234, 'End of built up area', 'information--end-of-built-up-area--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (235, 'End of built up area', 'information--end-of-built-up-area--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (236, 'End of built up area', 'information--end-of-built-up-area--g4.svg', 'information');
INSERT INTO public.road_signs VALUES (237, 'End of car pool lane', 'information--end-of-car-pool-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (238, 'End of limited access road', 'information--end-of-limited-access-road--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (239, 'End of living street', 'information--end-of-living-street--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (240, 'End of living street', 'information--end-of-living-street--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (241, 'End of minimum speed 10', 'information--end-of-minimum-speed-10--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (242, 'End of minimum speed 100', 'information--end-of-minimum-speed-100--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (243, 'End of minimum speed 110', 'information--end-of-minimum-speed-110--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (244, 'End of minimum speed 120', 'information--end-of-minimum-speed-120--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (245, 'End of minimum speed 130', 'information--end-of-minimum-speed-130--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (246, 'End of minimum speed 20', 'information--end-of-minimum-speed-20--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (247, 'End of minimum speed 25', 'information--end-of-minimum-speed-25--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (248, 'End of minimum speed 30', 'information--end-of-minimum-speed-30--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (249, 'End of minimum speed 35', 'information--end-of-minimum-speed-35--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (250, 'End of minimum speed 40', 'information--end-of-minimum-speed-40--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (251, 'End of minimum speed 50', 'information--end-of-minimum-speed-50--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (252, 'End of minimum speed 60', 'information--end-of-minimum-speed-60--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (253, 'End of minimum speed 70', 'information--end-of-minimum-speed-70--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (254, 'End of minimum speed 75', 'information--end-of-minimum-speed-75--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (255, 'End of minimum speed 80', 'information--end-of-minimum-speed-80--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (256, 'End of minimum speed 90', 'information--end-of-minimum-speed-90--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (257, 'End of motorway', 'information--end-of-motorway--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (258, 'End of overtaking permitted heavy good vehicles', 'information--end-of-overtaking-permitted-heavy-good-vehicles--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (259, 'End of road works', 'information--end-of-road-works--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (260, 'End of tunnel', 'information--end-of-tunnel--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (261, 'End of tunnel', 'information--end-of-tunnel--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (262, 'End of two way traffic', 'information--end-of-two-way-traffic--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (263, 'Equestrians permitted', 'information--equestrians-permitted--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (264, 'Exit ahead', 'information--exit-ahead--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (265, 'Exit ahead', 'information--exit-ahead--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (266, 'Exit ahead', 'information--exit-ahead--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (267, 'Flight port', 'information--flight-port--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (268, 'Food', 'information--food--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (269, 'Food', 'information--food--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (270, 'Gas station', 'information--gas-station--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (271, 'Gas station', 'information--gas-station--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (272, 'Gas station', 'information--gas-station--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (273, 'General speed limit at city border', 'information--general-speed-limit-at-city-border--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (274, 'Go left', 'information--go-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (275, 'Go right', 'information--go-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (276, 'Go straight', 'information--go-straight--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (277, 'Go straight or left', 'information--go-straight-or-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (278, 'Go straight or right', 'information--go-straight-or-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (279, 'Go straight or turn left', 'information--go-straight-or-turn-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (280, 'Go straight or turn right', 'information--go-straight-or-turn-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (281, 'Hazardous goods vehicles lane', 'information--hazardous-goods-vehicles-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (282, 'Height limit', 'information--height-limit--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (283, 'Height limit', 'information--height-limit--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (284, 'Highway directions', 'information--highway-directions--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (285, 'Highway exit', 'information--highway-exit--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (286, 'Highway interchange', 'information--highway-interchange--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (287, 'Highway interstate route', 'information--highway-interstate-route--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (288, 'Highway interstate route', 'information--highway-interstate-route--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (289, 'Highway preferential lane', 'information--highway-preferential-lane--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (290, 'Highway preferential lane', 'information--highway-preferential-lane--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (291, 'Highway reference location', 'information--highway-reference-location--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (292, 'Highway reference location', 'information--highway-reference-location--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (293, 'Hiking', 'information--hiking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (294, 'Hospital', 'information--hospital--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (295, 'Hurricane evacuation route', 'information--hurricane-evacuation-route--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (296, 'Interstate route', 'information--interstate-route--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (297, 'Lane control intersections', 'information--lane-control-intersections--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (298, 'Lane control left turn', 'information--lane-control-left-turn--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (299, 'Lane control multiple lanes', 'information--lane-control-multiple-lanes--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (300, 'Lane control multiple lanes', 'information--lane-control-multiple-lanes--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (301, 'Lane control right turn', 'information--lane-control-right-turn--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (302, 'Limited access road', 'information--limited-access-road--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (303, 'Litter container', 'information--litter-container--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (304, 'Living street', 'information--living-street--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (305, 'Living street', 'information--living-street--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (306, 'Living street', 'information--living-street--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (307, 'Lodging', 'information--lodging--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (308, 'Lodging', 'information--lodging--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (309, 'Minimum speed 10', 'information--minimum-speed-10--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (310, 'Minimum speed 100', 'information--minimum-speed-100--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (311, 'Minimum speed 110', 'information--minimum-speed-110--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (312, 'Minimum speed 120', 'information--minimum-speed-120--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (313, 'Minimum speed 130', 'information--minimum-speed-130--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (314, 'Minimum speed 20', 'information--minimum-speed-20--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (315, 'Minimum speed 25', 'information--minimum-speed-25--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (316, 'Minimum speed 30', 'information--minimum-speed-30--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (317, 'Minimum speed 35', 'information--minimum-speed-35--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (318, 'Minimum speed 40', 'information--minimum-speed-40--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (319, 'Minimum speed 50', 'information--minimum-speed-50--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (320, 'Minimum speed 60', 'information--minimum-speed-60--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (321, 'Minimum speed 70', 'information--minimum-speed-70--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (322, 'Minimum speed 75', 'information--minimum-speed-75--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (323, 'Minimum speed 80', 'information--minimum-speed-80--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (324, 'Minimum speed 90', 'information--minimum-speed-90--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (325, 'Motorway', 'information--motorway--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (326, 'Motorway exit ahead', 'information--motorway-exit-ahead--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (327, 'Motorway exit ahead', 'information--motorway-exit-ahead--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (328, 'Motorway exit ahead', 'information--motorway-exit-ahead--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (329, 'Overtaking allowed heavy good vehicles', 'information--overtaking-allowed-heavy-good-vehicles--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (330, 'Parallel parking', 'information--parallel-parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (331, 'Park and ride', 'information--park-and-ride--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (332, 'Park and ride', 'information--park-and-ride--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (333, 'Parking', 'information--parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (334, 'Parking', 'information--parking--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (335, 'Parking', 'information--parking--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (336, 'Parking', 'information--parking--g4.svg', 'information');
INSERT INTO public.road_signs VALUES (337, 'Parking', 'information--parking--g5.svg', 'information');
INSERT INTO public.road_signs VALUES (338, 'Parking', 'information--parking--g6.svg', 'information');
INSERT INTO public.road_signs VALUES (339, 'Parking area', 'information--parking-area--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (340, 'Parking with restrictions', 'information--parking-with-restrictions--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (341, 'Pass on either side', 'information--pass-on-either-side--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (342, 'Passenger loading zone', 'information--passenger-loading-zone--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (343, 'Pedestrians crossing', 'information--pedestrians-crossing--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (344, 'Pedestrians crossing', 'information--pedestrians-crossing--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (345, 'Pedestrians crossing', 'information--pedestrians-crossing--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (346, 'Pedestrians only', 'information--pedestrians-only--g4.svg', 'information');
INSERT INTO public.road_signs VALUES (347, 'Pedestrians permitted', 'information--pedestrians-permitted--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (348, 'Perpendicular parking', 'information--perpendicular-parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (349, 'Picnic site', 'information--picnic-site--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (350, 'Playground', 'information--playground--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (351, 'Recreational vehicle sanitary station', 'information--recreational-vehicle-sanitary-station--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (352, 'Recycle collection center', 'information--recycle-collection-center--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (353, 'Rest area', 'information--rest-area--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (354, 'Road bump', 'information--road-bump--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (355, 'Road skating', 'information--road-skating--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (356, 'Safety zone', 'information--safety-zone--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (357, 'Safety zone', 'information--safety-zone--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (358, 'Safety zone', 'information--safety-zone--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (359, 'Shared path vehicles and motorcycles', 'information--shared-path-vehicles-and-motorcycles--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (360, 'Stairs', 'information--stairs--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (361, 'Stairs', 'information--stairs--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (362, 'Stairs', 'information--stairs--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (363, 'Stairs', 'information--stairs--g4.svg', 'information');
INSERT INTO public.road_signs VALUES (364, 'Stop line', 'information--stop-line--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (365, 'Stop permitted', 'information--stop-permitted--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (366, 'Street name one line', 'information--street-name-one-line--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (367, 'Street name three lines', 'information--street-name-three-lines--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (368, 'Street name two lines', 'information--street-name-two-lines--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (369, 'Subway', 'information--subway--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (370, 'Telephone', 'information--telephone--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (371, 'Telephone', 'information--telephone--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (372, 'Telephone device for the deaf', 'information--telephone-device-for-the-deaf--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (373, 'Toll station', 'information--toll-station--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (374, 'Tourism information', 'information--tourism-information--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (375, 'Tourist attraction', 'information--tourist-attraction--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (376, 'Traffic merges left', 'information--traffic-merges-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (377, 'Traffic merges right', 'information--traffic-merges-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (378, 'Trail crossing', 'information--trail-crossing--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (379, 'Trail crossing', 'information--trail-crossing--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (380, 'Trail crossing', 'information--trail-crossing--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (381, 'Trailer camping', 'information--trailer-camping--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (382, 'Train or light rail station', 'information--train-or-light-rail-station--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (383, 'Tram bus stop', 'information--tram-bus-stop--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (384, 'Tram bus stop', 'information--tram-bus-stop--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (385, 'Trams crossing', 'information--trams-crossing--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (386, 'Truck lane left', 'information--truck-lane-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (387, 'Truck parking', 'information--truck-parking--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (388, 'Truck trailer lane right', 'information--truck-trailer-lane-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (389, 'Truck trailer lane straight', 'information--truck-trailer-lane-straight--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (390, 'Trucks both ways', 'information--trucks-both-ways--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (391, 'Trucks only', 'information--trucks-only--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (392, 'Tsunami evacuation_route', 'information--tsunami-evacuation_route--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (393, 'Tunnel', 'information--tunnel--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (394, 'Tunnel', 'information--tunnel--g2.svg', 'information');
INSERT INTO public.road_signs VALUES (395, 'Tunnel', 'information--tunnel--g3.svg', 'information');
INSERT INTO public.road_signs VALUES (396, 'Tunnel ahead', 'information--tunnel-ahead--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (397, 'Turn left', 'information--turn-left--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (398, 'Turn left ahead', 'information--turn-left-ahead--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (399, 'Turn right', 'information--turn-right--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (400, 'Turn right ahead', 'information--turn-right-ahead--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (401, 'Urban area', 'information--urban-area--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (402, 'Vehicles on rails', 'information--vehicles-on-rails--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (403, 'Water protection zone', 'information--water-protection-zone--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (404, 'Weight and height limit', 'information--weight-and-height-limit--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (405, 'Weight limit', 'information--weight-limit--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (406, 'Wireless internet', 'information--wireless-internet--g1.svg', 'information');
INSERT INTO public.road_signs VALUES (407, 'Advisory maximum speed limit', 'regulatory--advisory-maximum-speed-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (408, 'All directions permitted', 'regulatory--all-directions-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (409, 'All way', 'regulatory--all-way--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (410, 'Atvs permitted', 'regulatory--atvs-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (411, 'Axle limit', 'regulatory--axle-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (412, 'Axle limit', 'regulatory--axle-limit--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (413, 'Bicycle lane left', 'regulatory--bicycle-lane-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (414, 'Bicycle parking', 'regulatory--bicycle-parking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (415, 'Bicycles and buses only', 'regulatory--bicycles-and-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (416, 'Bicycles only', 'regulatory--bicycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (417, 'Bicycles only', 'regulatory--bicycles-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (418, 'Bicycles only', 'regulatory--bicycles-only--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (419, 'Bicycles only', 'regulatory--bicycles-only--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (420, 'Bicycles push button', 'regulatory--bicycles-push-button--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (421, 'Bicycles push button', 'regulatory--bicycles-push-button--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (422, 'Bicycles stop on red', 'regulatory--bicycles-stop-on-red--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (423, 'Bicycles wrong way', 'regulatory--bicycles-wrong-way--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (424, 'Bicycles yield or use signal', 'regulatory--bicycles-yield-or-use-signal--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (425, 'Bike route', 'regulatory--bike-route--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (426, 'Building direction', 'regulatory--building-direction--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (427, 'Bus priority lane', 'regulatory--bus-priority-lane--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (428, 'Buses and taxi only', 'regulatory--buses-and-taxi-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (429, 'Buses only', 'regulatory--buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (430, 'Buses only', 'regulatory--buses-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (431, 'Circular intersection', 'regulatory--circular-intersection--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (432, 'Circular intersection', 'regulatory--circular-intersection--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (433, 'Circular intersection', 'regulatory--circular-intersection--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (434, 'Circular intersection', 'regulatory--circular-intersection--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (435, 'Cross only on green', 'regulatory--cross-only-on-green--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (436, 'Cross only on pedestrian signal', 'regulatory--cross-only-on-pedestrian-signal--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (437, 'Crosswalk stop on red', 'regulatory--crosswalk-stop-on-red--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (438, 'Cycling restriction', 'regulatory--cycling-restriction--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (439, 'Cyclists dismount and walk', 'regulatory--cyclists-dismount-and-walk--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (440, 'Detour left', 'regulatory--detour-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (441, 'Detour right', 'regulatory--detour-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (442, 'Divided highway crossing', 'regulatory--divided-highway-crossing--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (443, 'Divided highway ends', 'regulatory--divided-highway-ends--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (444, 'Divided highway starts', 'regulatory--divided-highway-starts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (445, 'Do not block intersection', 'regulatory--do-not-block-intersection--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (446, 'Do not pass', 'regulatory--do-not-pass--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (447, 'Do not stop on tracks', 'regulatory--do-not-stop-on-tracks--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (448, 'Dual lanes all directions on left', 'regulatory--dual-lanes-all-directions-on-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (449, 'Dual lanes all directions on right', 'regulatory--dual-lanes-all-directions-on-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (450, 'Dual lanes bicyclists and pedestrians', 'regulatory--dual-lanes-bicyclists-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (451, 'Dual lanes go left or right', 'regulatory--dual-lanes-go-left-or-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (452, 'Dual lanes go straight on left', 'regulatory--dual-lanes-go-straight-on-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (453, 'Dual lanes go straight on right', 'regulatory--dual-lanes-go-straight-on-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (454, 'Dual lanes turn left', 'regulatory--dual-lanes-turn-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (455, 'Dual lanes turn left no u turn', 'regulatory--dual-lanes-turn-left-no-u-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (456, 'Dual lanes turn left or straight', 'regulatory--dual-lanes-turn-left-or-straight--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (457, 'Dual lanes turn right or straight', 'regulatory--dual-lanes-turn-right-or-straight--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (458, 'Dual path bicycles and pedestrians', 'regulatory--dual-path-bicycles-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (459, 'Dual path bicycles and pedestrians', 'regulatory--dual-path-bicycles-and-pedestrians--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (460, 'Dual path bicycles and pedestrians', 'regulatory--dual-path-bicycles-and-pedestrians--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (461, 'Dual path equestrians and pedestrians', 'regulatory--dual-path-equestrians-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1059, 'Cliff', 'warning--cliff--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (462, 'Dual path equestrians and pedestrians bicycles', 'regulatory--dual-path-equestrians-and-pedestrians-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (463, 'Dual path pedestrians and bicycles', 'regulatory--dual-path-pedestrians-and-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (464, 'Dual path pedestrians and bicycles', 'regulatory--dual-path-pedestrians-and-bicycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (465, 'Dual path pedestrians and equestrians', 'regulatory--dual-path-pedestrians-and-equestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (466, 'Dual path pedestrians bicycles and equestrians', 'regulatory--dual-path-pedestrians-bicycles-and-equestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (467, 'Dual speed limits', 'regulatory--dual-speed-limits--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (468, 'Dual speed limits', 'regulatory--dual-speed-limits--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (469, 'End of bicycles only', 'regulatory--end-of-bicycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (470, 'End of bicycles only', 'regulatory--end-of-bicycles-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (471, 'End of bus and taxi only', 'regulatory--end-of-bus-and-taxi-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (472, 'End of buses only', 'regulatory--end-of-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (473, 'End of buses only', 'regulatory--end-of-buses-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (474, 'End of cycling restriction', 'regulatory--end-of-cycling-restriction--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (475, 'End of dual path bicycles and pedestrians', 'regulatory--end-of-dual-path-bicycles-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (476, 'End of dual path pedestrians and bicycles', 'regulatory--end-of-dual-path-pedestrians-and-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (477, 'End of equestrians only', 'regulatory--end-of-equestrians-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (478, 'End of low beam headlights', 'regulatory--end-of-low-beam-headlights--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (479, 'End of maximum speed limit', 'regulatory--end-of-maximum-speed-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (480, 'End of maximum speed limit 10', 'regulatory--end-of-maximum-speed-limit-10--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (481, 'End of maximum speed limit 10', 'regulatory--end-of-maximum-speed-limit-10--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (482, 'End of maximum speed limit 100', 'regulatory--end-of-maximum-speed-limit-100--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (483, 'End of maximum speed limit 100', 'regulatory--end-of-maximum-speed-limit-100--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (484, 'End of maximum speed limit 110', 'regulatory--end-of-maximum-speed-limit-110--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (485, 'End of maximum speed limit 110', 'regulatory--end-of-maximum-speed-limit-110--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (486, 'End of maximum speed limit 120', 'regulatory--end-of-maximum-speed-limit-120--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (487, 'End of maximum speed limit 120', 'regulatory--end-of-maximum-speed-limit-120--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (488, 'End of maximum speed limit 130', 'regulatory--end-of-maximum-speed-limit-130--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (489, 'End of maximum speed limit 130', 'regulatory--end-of-maximum-speed-limit-130--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (490, 'End of maximum speed limit 20', 'regulatory--end-of-maximum-speed-limit-20--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (491, 'End of maximum speed limit 20', 'regulatory--end-of-maximum-speed-limit-20--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (492, 'End of maximum speed limit 25', 'regulatory--end-of-maximum-speed-limit-25--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (493, 'End of maximum speed limit 25', 'regulatory--end-of-maximum-speed-limit-25--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (494, 'End of maximum speed limit 30', 'regulatory--end-of-maximum-speed-limit-30--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (495, 'End of maximum speed limit 30', 'regulatory--end-of-maximum-speed-limit-30--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (496, 'End of maximum speed limit 35', 'regulatory--end-of-maximum-speed-limit-35--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (497, 'End of maximum speed limit 35', 'regulatory--end-of-maximum-speed-limit-35--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (498, 'End of maximum speed limit 40', 'regulatory--end-of-maximum-speed-limit-40--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (499, 'End of maximum speed limit 40', 'regulatory--end-of-maximum-speed-limit-40--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (500, 'End of maximum speed limit 50', 'regulatory--end-of-maximum-speed-limit-50--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (501, 'End of maximum speed limit 50', 'regulatory--end-of-maximum-speed-limit-50--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (502, 'End of maximum speed limit 60', 'regulatory--end-of-maximum-speed-limit-60--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (503, 'End of maximum speed limit 60', 'regulatory--end-of-maximum-speed-limit-60--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (504, 'End of maximum speed limit 65', 'regulatory--end-of-maximum-speed-limit-65--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (505, 'End of maximum speed limit 65', 'regulatory--end-of-maximum-speed-limit-65--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (506, 'End of maximum speed limit 70', 'regulatory--end-of-maximum-speed-limit-70--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (507, 'End of maximum speed limit 70', 'regulatory--end-of-maximum-speed-limit-70--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (508, 'End of maximum speed limit 75', 'regulatory--end-of-maximum-speed-limit-75--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (509, 'End of maximum speed limit 75', 'regulatory--end-of-maximum-speed-limit-75--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (510, 'End of maximum speed limit 80', 'regulatory--end-of-maximum-speed-limit-80--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (511, 'End of maximum speed limit 80', 'regulatory--end-of-maximum-speed-limit-80--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (512, 'End of maximum speed limit 90', 'regulatory--end-of-maximum-speed-limit-90--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (513, 'End of maximum speed limit 90', 'regulatory--end-of-maximum-speed-limit-90--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (514, 'End of mopeds and bicycles only', 'regulatory--end-of-mopeds-and-bicycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (515, 'End of no heavy goods vehicles', 'regulatory--end-of-no-heavy-goods-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (516, 'End of no horn', 'regulatory--end-of-no-horn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (517, 'End of no overtaking', 'regulatory--end-of-no-overtaking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (518, 'End of no overtaking', 'regulatory--end-of-no-overtaking--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (519, 'End of no overtaking', 'regulatory--end-of-no-overtaking--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (520, 'End of no overtaking', 'regulatory--end-of-no-overtaking--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (521, 'End of no overtaking', 'regulatory--end-of-no-overtaking--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (522, 'End of no overtaking by heavy goods vehicles', 'regulatory--end-of-no-overtaking-by-heavy-goods-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (523, 'End of no overtaking by heavy goods vehicles', 'regulatory--end-of-no-overtaking-by-heavy-goods-vehicles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (524, 'End of no overtaking by motorcycles', 'regulatory--end-of-no-overtaking-by-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (525, 'End of no parking', 'regulatory--end-of-no-parking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (526, 'End of no parking', 'regulatory--end-of-no-parking--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (527, 'End of no parking or stopping', 'regulatory--end-of-no-parking-or-stopping--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (528, 'End of one way straight', 'regulatory--end-of-one-way-straight--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (529, 'End of parking zone', 'regulatory--end-of-parking-zone--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (530, 'End of parking zone', 'regulatory--end-of-parking-zone--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (531, 'End of pedestrians only', 'regulatory--end-of-pedestrians-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (532, 'End of pedestrians only', 'regulatory--end-of-pedestrians-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (533, 'End of pedestrians only', 'regulatory--end-of-pedestrians-only--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (534, 'End of pedestrians only', 'regulatory--end-of-pedestrians-only--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (535, 'End of priority road', 'regulatory--end-of-priority-road--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (536, 'End of prohibition', 'regulatory--end-of-prohibition--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (537, 'End of school zone', 'regulatory--end-of-school-zone--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (538, 'End of shared path bicycles and pedestrians', 'regulatory--end-of-shared-path-bicycles-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (539, 'End of shared path pedestrians and bicycles', 'regulatory--end-of-shared-path-pedestrians-and-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (540, 'End of snow chains', 'regulatory--end-of-snow-chains--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (541, 'End of snow chains', 'regulatory--end-of-snow-chains--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (542, 'End of snowmobiles only', 'regulatory--end-of-snowmobiles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (543, 'End of speed limit zone', 'regulatory--end-of-speed-limit-zone--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (544, 'End of speed limit zone', 'regulatory--end-of-speed-limit-zone--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (545, 'End of speed limit zone', 'regulatory--end-of-speed-limit-zone--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (546, 'End of tractors only', 'regulatory--end-of-tractors-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (547, 'End of trams and buses only', 'regulatory--end-of-trams-and-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (548, 'End of trams only', 'regulatory--end-of-trams-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (549, 'End of trucks and buses only', 'regulatory--end-of-trucks-and-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (550, 'End of trucks only', 'regulatory--end-of-trucks-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (551, 'End of trucks only', 'regulatory--end-of-trucks-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (552, 'Equestrians only', 'regulatory--equestrians-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (553, 'Except railroad crossing', 'regulatory--except-railroad-crossing--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (554, 'Fine for littering', 'regulatory--fine-for-littering--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (555, 'Give way to bicycles', 'regulatory--give-way-to-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (556, 'Give way to oncoming traffic', 'regulatory--give-way-to-oncoming-traffic--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (557, 'Give way to oncoming traffic', 'regulatory--give-way-to-oncoming-traffic--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (558, 'Go left bicycles', 'regulatory--go-left-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (559, 'Go right bicycles', 'regulatory--go-right-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (560, 'Go straight', 'regulatory--go-straight--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (561, 'Go straight', 'regulatory--go-straight--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (562, 'Go straight bicycles', 'regulatory--go-straight-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (563, 'Go straight or turn left', 'regulatory--go-straight-or-turn-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (564, 'Go straight or turn left', 'regulatory--go-straight-or-turn-left--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (565, 'Go straight or turn left', 'regulatory--go-straight-or-turn-left--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (566, 'Go straight or turn right', 'regulatory--go-straight-or-turn-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (567, 'Go straight or turn right', 'regulatory--go-straight-or-turn-right--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (568, 'Go straight or turn right', 'regulatory--go-straight-or-turn-right--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (569, 'Heavy goods vehicles permitted', 'regulatory--heavy-goods-vehicles-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (570, 'Height limit', 'regulatory--height-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (571, 'High beam headlights', 'regulatory--high-beam-headlights--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (572, 'Horn', 'regulatory--horn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (573, 'In street pedestrian crossing', 'regulatory--in-street-pedestrian-crossing--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (574, 'Keep left', 'regulatory--keep-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (575, 'Keep left', 'regulatory--keep-left--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (576, 'Keep left', 'regulatory--keep-left--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (577, 'Keep left', 'regulatory--keep-left--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (578, 'Keep left', 'regulatory--keep-left--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (579, 'Keep left', 'regulatory--keep-left--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (580, 'Keep left', 'regulatory--keep-left--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (581, 'Keep right', 'regulatory--keep-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (582, 'Keep right', 'regulatory--keep-right--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (583, 'Keep right', 'regulatory--keep-right--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (584, 'Keep right', 'regulatory--keep-right--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (585, 'Keep right', 'regulatory--keep-right--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (586, 'Keep right', 'regulatory--keep-right--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (587, 'Keep right', 'regulatory--keep-right--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (588, 'Keep right', 'regulatory--keep-right--g8.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (589, 'Keep right', 'regulatory--keep-right--g9.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (590, 'Lane control', 'regulatory--lane-control--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (591, 'Left turn yield on green', 'regulatory--left-turn-yield-on-green--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (592, 'Length limit', 'regulatory--length-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (593, 'Length limit', 'regulatory--length-limit--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (594, 'Light rail divided highway', 'regulatory--light-rail-divided-highway--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (595, 'Light rail do not pass', 'regulatory--light-rail-do-not-pass--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (596, 'Light rail only', 'regulatory--light-rail-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (597, 'Look', 'regulatory--look--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (598, 'Low beam headlights', 'regulatory--low-beam-headlights--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (599, 'Low beam headlights', 'regulatory--low-beam-headlights--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (600, 'Low beam headlights', 'regulatory--low-beam-headlights--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (601, 'Low speed vehicle permitted', 'regulatory--low-speed-vehicle-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (602, 'Maximum speed limit 10', 'regulatory--maximum-speed-limit-10--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (603, 'Maximum speed limit 10', 'regulatory--maximum-speed-limit-10--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (604, 'Maximum speed limit 100', 'regulatory--maximum-speed-limit-100--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (605, 'Maximum speed limit 100', 'regulatory--maximum-speed-limit-100--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (606, 'Maximum speed limit 110', 'regulatory--maximum-speed-limit-110--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (607, 'Maximum speed limit 110', 'regulatory--maximum-speed-limit-110--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (608, 'Maximum speed limit 120', 'regulatory--maximum-speed-limit-120--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (609, 'Maximum speed limit 120', 'regulatory--maximum-speed-limit-120--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (610, 'Maximum speed limit 130', 'regulatory--maximum-speed-limit-130--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (611, 'Maximum speed limit 130', 'regulatory--maximum-speed-limit-130--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (612, 'Maximum speed limit 15', 'regulatory--maximum-speed-limit-15--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (613, 'Maximum speed limit 15', 'regulatory--maximum-speed-limit-15--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (614, 'Maximum speed limit 20', 'regulatory--maximum-speed-limit-20--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (615, 'Maximum speed limit 20', 'regulatory--maximum-speed-limit-20--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (616, 'Maximum speed limit 25', 'regulatory--maximum-speed-limit-25--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (617, 'Maximum speed limit 25', 'regulatory--maximum-speed-limit-25--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (618, 'Maximum speed limit 30', 'regulatory--maximum-speed-limit-30--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (619, 'Maximum speed limit 30', 'regulatory--maximum-speed-limit-30--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (620, 'Maximum speed limit 35', 'regulatory--maximum-speed-limit-35--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (621, 'Maximum speed limit 35', 'regulatory--maximum-speed-limit-35--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (622, 'Maximum speed limit 40', 'regulatory--maximum-speed-limit-40--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (623, 'Maximum speed limit 40', 'regulatory--maximum-speed-limit-40--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (624, 'Maximum speed limit 45', 'regulatory--maximum-speed-limit-45--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (625, 'Maximum speed limit 45', 'regulatory--maximum-speed-limit-45--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (626, 'Maximum speed limit 5', 'regulatory--maximum-speed-limit-5--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (627, 'Maximum speed limit 5', 'regulatory--maximum-speed-limit-5--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (628, 'Maximum speed limit 50', 'regulatory--maximum-speed-limit-50--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (629, 'Maximum speed limit 50', 'regulatory--maximum-speed-limit-50--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (630, 'Maximum speed limit 55', 'regulatory--maximum-speed-limit-55--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (631, 'Maximum speed limit 60', 'regulatory--maximum-speed-limit-60--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (632, 'Maximum speed limit 60', 'regulatory--maximum-speed-limit-60--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (633, 'Maximum speed limit 65', 'regulatory--maximum-speed-limit-65--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (634, 'Maximum speed limit 65', 'regulatory--maximum-speed-limit-65--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (635, 'Maximum speed limit 70', 'regulatory--maximum-speed-limit-70--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (636, 'Maximum speed limit 70', 'regulatory--maximum-speed-limit-70--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (637, 'Maximum speed limit 75', 'regulatory--maximum-speed-limit-75--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (638, 'Maximum speed limit 80', 'regulatory--maximum-speed-limit-80--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (639, 'Maximum speed limit 80', 'regulatory--maximum-speed-limit-80--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (640, 'Maximum speed limit 85', 'regulatory--maximum-speed-limit-85--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (641, 'Maximum speed limit 90', 'regulatory--maximum-speed-limit-90--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (642, 'Maximum speed limit 90', 'regulatory--maximum-speed-limit-90--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (643, 'Maximum speed limit led 10', 'regulatory--maximum-speed-limit-led-10--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (644, 'Maximum speed limit led 10', 'regulatory--maximum-speed-limit-led-10--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (645, 'Maximum speed limit led 10', 'regulatory--maximum-speed-limit-led-10--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (646, 'Maximum speed limit led 100', 'regulatory--maximum-speed-limit-led-100--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (647, 'Maximum speed limit led 110', 'regulatory--maximum-speed-limit-led-110--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (648, 'Maximum speed limit led 120', 'regulatory--maximum-speed-limit-led-120--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (649, 'Maximum speed limit led 130', 'regulatory--maximum-speed-limit-led-130--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (650, 'Maximum speed limit led 15', 'regulatory--maximum-speed-limit-led-15--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (651, 'Maximum speed limit led 15', 'regulatory--maximum-speed-limit-led-15--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (652, 'Maximum speed limit led 20', 'regulatory--maximum-speed-limit-led-20--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (653, 'Maximum speed limit led 20', 'regulatory--maximum-speed-limit-led-20--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (654, 'Maximum speed limit led 20', 'regulatory--maximum-speed-limit-led-20--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (655, 'Maximum speed limit led 25', 'regulatory--maximum-speed-limit-led-25--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (656, 'Maximum speed limit led 25', 'regulatory--maximum-speed-limit-led-25--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (657, 'Maximum speed limit led 25', 'regulatory--maximum-speed-limit-led-25--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (658, 'Maximum speed limit led 30', 'regulatory--maximum-speed-limit-led-30--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (659, 'Maximum speed limit led 30', 'regulatory--maximum-speed-limit-led-30--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (660, 'Maximum speed limit led 30', 'regulatory--maximum-speed-limit-led-30--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (661, 'Maximum speed limit led 35', 'regulatory--maximum-speed-limit-led-35--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (662, 'Maximum speed limit led 35', 'regulatory--maximum-speed-limit-led-35--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (663, 'Maximum speed limit led 35', 'regulatory--maximum-speed-limit-led-35--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (664, 'Maximum speed limit led 40', 'regulatory--maximum-speed-limit-led-40--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (665, 'Maximum speed limit led 40', 'regulatory--maximum-speed-limit-led-40--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (666, 'Maximum speed limit led 40', 'regulatory--maximum-speed-limit-led-40--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (667, 'Maximum speed limit led 45', 'regulatory--maximum-speed-limit-led-45--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (668, 'Maximum speed limit led 45', 'regulatory--maximum-speed-limit-led-45--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (669, 'Maximum speed limit led 5', 'regulatory--maximum-speed-limit-led-5--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (670, 'Maximum speed limit led 5', 'regulatory--maximum-speed-limit-led-5--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (671, 'Maximum speed limit led 50', 'regulatory--maximum-speed-limit-led-50--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (672, 'Maximum speed limit led 50', 'regulatory--maximum-speed-limit-led-50--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (673, 'Maximum speed limit led 50', 'regulatory--maximum-speed-limit-led-50--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (674, 'Maximum speed limit led 55', 'regulatory--maximum-speed-limit-led-55--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (675, 'Maximum speed limit led 55', 'regulatory--maximum-speed-limit-led-55--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (676, 'Maximum speed limit led 60', 'regulatory--maximum-speed-limit-led-60--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (677, 'Maximum speed limit led 60', 'regulatory--maximum-speed-limit-led-60--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (678, 'Maximum speed limit led 60', 'regulatory--maximum-speed-limit-led-60--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (679, 'Maximum speed limit led 65', 'regulatory--maximum-speed-limit-led-65--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (680, 'Maximum speed limit led 65', 'regulatory--maximum-speed-limit-led-65--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (681, 'Maximum speed limit led 70', 'regulatory--maximum-speed-limit-led-70--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (682, 'Maximum speed limit led 70', 'regulatory--maximum-speed-limit-led-70--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (683, 'Maximum speed limit led 70', 'regulatory--maximum-speed-limit-led-70--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (684, 'Maximum speed limit led 75', 'regulatory--maximum-speed-limit-led-75--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (685, 'Maximum speed limit led 75', 'regulatory--maximum-speed-limit-led-75--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (686, 'Maximum speed limit led 75', 'regulatory--maximum-speed-limit-led-75--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (687, 'Maximum speed limit led 80', 'regulatory--maximum-speed-limit-led-80--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (688, 'Maximum speed limit led 80', 'regulatory--maximum-speed-limit-led-80--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (689, 'Maximum speed limit led 80', 'regulatory--maximum-speed-limit-led-80--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (690, 'Maximum speed limit led 85', 'regulatory--maximum-speed-limit-led-85--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (691, 'Maximum speed limit led 85', 'regulatory--maximum-speed-limit-led-85--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (692, 'Maximum speed limit led 90', 'regulatory--maximum-speed-limit-led-90--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (693, 'Minimum safe distance', 'regulatory--minimum-safe-distance--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (694, 'Minimum safe distance', 'regulatory--minimum-safe-distance--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (695, 'Mopeds and bicycles only', 'regulatory--mopeds-and-bicycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (696, 'Motorcycles and bicycles only', 'regulatory--motorcycles-and-bicycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (697, 'Motorcycles only', 'regulatory--motorcycles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (698, 'Motorcycles only', 'regulatory--motorcycles-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (699, 'Night speed limit 10', 'regulatory--night-speed-limit-10--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (700, 'Night speed limit 15', 'regulatory--night-speed-limit-15--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (701, 'Night speed limit 20', 'regulatory--night-speed-limit-20--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (702, 'Night speed limit 25', 'regulatory--night-speed-limit-25--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (703, 'Night speed limit 30', 'regulatory--night-speed-limit-30--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (704, 'Night speed limit 35', 'regulatory--night-speed-limit-35--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (705, 'Night speed limit 40', 'regulatory--night-speed-limit-40--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (706, 'Night speed limit 45', 'regulatory--night-speed-limit-45--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (707, 'Night speed limit 5', 'regulatory--night-speed-limit-5--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (708, 'Night speed limit 50', 'regulatory--night-speed-limit-50--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (709, 'Night speed limit 55', 'regulatory--night-speed-limit-55--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (710, 'Night speed limit 60', 'regulatory--night-speed-limit-60--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (711, 'Night speed limit 65', 'regulatory--night-speed-limit-65--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (712, 'Night speed limit 70', 'regulatory--night-speed-limit-70--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (713, 'Night speed limit 75', 'regulatory--night-speed-limit-75--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (714, 'Night speed limit 80', 'regulatory--night-speed-limit-80--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (715, 'Night speed limit 85', 'regulatory--night-speed-limit-85--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (716, 'No abnormal vehicles', 'regulatory--no-abnormal-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (717, 'No atvs', 'regulatory--no-atvs--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (718, 'No bicycles', 'regulatory--no-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (719, 'No bicycles', 'regulatory--no-bicycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (720, 'No bicycles', 'regulatory--no-bicycles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (721, 'No bicycles carts or hand carts', 'regulatory--no-bicycles-carts-or-hand-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (722, 'No bicycles mopeds or motorcycles', 'regulatory--no-bicycles-mopeds-or-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (723, 'No bicycles mopeds or motorcycles', 'regulatory--no-bicycles-mopeds-or-motorcycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (724, 'No bicycles or hand carts', 'regulatory--no-bicycles-or-hand-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (725, 'No bicycles or motorcycles', 'regulatory--no-bicycles-or-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (726, 'No bicycles tractors or carts', 'regulatory--no-bicycles-tractors-or-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (727, 'No buses', 'regulatory--no-buses--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (728, 'No buses', 'regulatory--no-buses--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (729, 'No buses', 'regulatory--no-buses--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (730, 'No caravan trailers', 'regulatory--no-caravan-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (731, 'No caravans', 'regulatory--no-caravans--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (732, 'No caravans or caravan trailers', 'regulatory--no-caravans-or-caravan-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (733, 'No cargo loading', 'regulatory--no-cargo-loading--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (734, 'No carts', 'regulatory--no-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (735, 'No carts', 'regulatory--no-carts--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (736, 'No carts', 'regulatory--no-carts--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (737, 'No carts or tractors', 'regulatory--no-carts-or-tractors--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (738, 'No construction vehicles', 'regulatory--no-construction-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (739, 'No entry', 'regulatory--no-entry--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (740, 'No equestrians', 'regulatory--no-equestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (741, 'No go straight or turn left', 'regulatory--no-go-straight-or-turn-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (742, 'No go straight or turn right', 'regulatory--no-go-straight-or-turn-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (743, 'No good trailers', 'regulatory--no-good-trailers--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (744, 'No goods vehicle trailers', 'regulatory--no-goods-vehicle-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (745, 'No hand carts', 'regulatory--no-hand-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (746, 'No hand carts', 'regulatory--no-hand-carts--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (747, 'No hand carts or bicycles', 'regulatory--no-hand-carts-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (748, 'No hawkers', 'regulatory--no-hawkers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (749, 'No heavy goods vehicles', 'regulatory--no-heavy-goods-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (750, 'No heavy goods vehicles', 'regulatory--no-heavy-goods-vehicles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (751, 'No heavy goods vehicles', 'regulatory--no-heavy-goods-vehicles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (752, 'No heavy goods vehicles', 'regulatory--no-heavy-goods-vehicles--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (753, 'No heavy goods vehicles', 'regulatory--no-heavy-goods-vehicles--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (754, 'No heavy goods vehicles motorcycles or bicycles', 'regulatory--no-heavy-goods-vehicles-motorcycles-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (755, 'No heavy goods vehicles motorcycles or bicycles', 'regulatory--no-heavy-goods-vehicles-motorcycles-or-bicycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (756, 'No heavy goods vehicles or buses', 'regulatory--no-heavy-goods-vehicles-or-buses--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (757, 'No heavy goods vehicles or tractors', 'regulatory--no-heavy-goods-vehicles-or-tractors--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (758, 'No heavy goods vehicles or trailers', 'regulatory--no-heavy-goods-vehicles-or-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (759, 'No horizontal turn', 'regulatory--no-horizontal-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (760, 'No horn', 'regulatory--no-horn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (761, 'No horn', 'regulatory--no-horn--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (762, 'No lane change to left', 'regulatory--no-lane-change-to-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (763, 'No lane change to right', 'regulatory--no-lane-change-to-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (764, 'No learner drivers', 'regulatory--no-learner-drivers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (765, 'No left or u turn', 'regulatory--no-left-or-u-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (766, 'No left turn', 'regulatory--no-left-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (767, 'No left turn', 'regulatory--no-left-turn--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (768, 'No left turn', 'regulatory--no-left-turn--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (769, 'No left turn', 'regulatory--no-left-turn--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (770, 'No left turn', 'regulatory--no-left-turn--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (771, 'No low speed vehicles', 'regulatory--no-low-speed-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (772, 'No mopeds or bicycles', 'regulatory--no-mopeds-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (773, 'No motor vehicle trailers', 'regulatory--no-motor-vehicle-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (774, 'No motor vehicles', 'regulatory--no-motor-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (775, 'No motor vehicles', 'regulatory--no-motor-vehicles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (776, 'No motor vehicles', 'regulatory--no-motor-vehicles--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (777, 'No motor vehicles', 'regulatory--no-motor-vehicles--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (778, 'No motor vehicles', 'regulatory--no-motor-vehicles--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (779, 'No motor vehicles', 'regulatory--no-motor-vehicles--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (780, 'No motor vehicles except motorcycles', 'regulatory--no-motor-vehicles-except-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (781, 'No motor vehicles except motorcycles', 'regulatory--no-motor-vehicles-except-motorcycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (782, 'No motor vehicles except motorcycles', 'regulatory--no-motor-vehicles-except-motorcycles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (783, 'No motor vehicles or bicycles', 'regulatory--no-motor-vehicles-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (784, 'No motor vehicles or buses', 'regulatory--no-motor-vehicles-or-buses--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (785, 'No motor vehicles or carts', 'regulatory--no-motor-vehicles-or-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (786, 'No motorcycles', 'regulatory--no-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (787, 'No motorcycles', 'regulatory--no-motorcycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (788, 'No overtaking', 'regulatory--no-overtaking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (789, 'No overtaking', 'regulatory--no-overtaking--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (790, 'No overtaking', 'regulatory--no-overtaking--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (791, 'No overtaking', 'regulatory--no-overtaking--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (792, 'No overtaking', 'regulatory--no-overtaking--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (793, 'No overtaking', 'regulatory--no-overtaking--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (794, 'No overtaking atvs', 'regulatory--no-overtaking-atvs--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (795, 'No overtaking by heavy goods vehicles', 'regulatory--no-overtaking-by-heavy-goods-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (796, 'No parking', 'regulatory--no-parking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (797, 'No parking', 'regulatory--no-parking--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (798, 'No parking', 'regulatory--no-parking--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (799, 'No parking', 'regulatory--no-parking--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (800, 'No parking', 'regulatory--no-parking--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (801, 'No parking', 'regulatory--no-parking--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (802, 'No parking', 'regulatory--no-parking--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (803, 'No parking', 'regulatory--no-parking--g8.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (804, 'No parking', 'regulatory--no-parking--g9.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (805, 'No parking bicycles or motorcycles', 'regulatory--no-parking-bicycles-or-motorcycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (806, 'No parking bus stop', 'regulatory--no-parking-bus-stop--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (807, 'No parking or no stopping', 'regulatory--no-parking-or-no-stopping--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (808, 'No parking or no stopping', 'regulatory--no-parking-or-no-stopping--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (809, 'No parking or no stopping', 'regulatory--no-parking-or-no-stopping--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (810, 'No parking or no stopping', 'regulatory--no-parking-or-no-stopping--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (811, 'No parking or no stopping', 'regulatory--no-parking-or-no-stopping--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (812, 'No passenger loading', 'regulatory--no-passenger-loading--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (813, 'No pedestrians', 'regulatory--no-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (814, 'No pedestrians', 'regulatory--no-pedestrians--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (815, 'No pedestrians', 'regulatory--no-pedestrians--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (816, 'No pedestrians', 'regulatory--no-pedestrians--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (817, 'No pedestrians', 'regulatory--no-pedestrians--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (818, 'No pedestrians', 'regulatory--no-pedestrians--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (819, 'No pedestrians bicycles animals or hand carts', 'regulatory--no-pedestrians-bicycles-animals-or-hand-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (820, 'No pedestrians or bicycles', 'regulatory--no-pedestrians-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (821, 'No pedestrians or bicycles', 'regulatory--no-pedestrians-or-bicycles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (822, 'No pedestrians or bicycles', 'regulatory--no-pedestrians-or-bicycles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (823, 'No rickshaws', 'regulatory--no-rickshaws--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (824, 'No rickshaws', 'regulatory--no-rickshaws--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (825, 'No rickshaws', 'regulatory--no-rickshaws--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (826, 'No right turn', 'regulatory--no-right-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (827, 'No right turn', 'regulatory--no-right-turn--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (828, 'No right turn', 'regulatory--no-right-turn--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (829, 'No right turn on red', 'regulatory--no-right-turn-on-red--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (830, 'No skiing', 'regulatory--no-skiing--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (831, 'No snowmobiles', 'regulatory--no-snowmobiles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (832, 'No snowmobiles', 'regulatory--no-snowmobiles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (833, 'No snowmobiles or atvs', 'regulatory--no-snowmobiles-or-atvs--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (834, 'No stopping', 'regulatory--no-stopping--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (835, 'No stopping', 'regulatory--no-stopping--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (836, 'No stopping', 'regulatory--no-stopping--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (837, 'No stopping', 'regulatory--no-stopping--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (838, 'No stopping', 'regulatory--no-stopping--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (839, 'No stopping', 'regulatory--no-stopping--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (840, 'No stopping on pavement', 'regulatory--no-stopping-on-pavement--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (841, 'No straight through', 'regulatory--no-straight-through--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (842, 'No straight through', 'regulatory--no-straight-through--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (843, 'No studded snow chains', 'regulatory--no-studded-snow-chains--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (844, 'No through trucks', 'regulatory--no-through-trucks--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (845, 'No tour buses', 'regulatory--no-tour-buses--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (846, 'No tractors', 'regulatory--no-tractors--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (847, 'No tractors mopeds or bicycles', 'regulatory--no-tractors-mopeds-or-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (848, 'No tractors or carts', 'regulatory--no-tractors-or-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (849, 'No trailers', 'regulatory--no-trailers--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (850, 'No tricycles', 'regulatory--no-tricycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (851, 'No tricycles or hand carts', 'regulatory--no-tricycles-or-hand-carts--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (852, 'No turn on red', 'regulatory--no-turn-on-red--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (853, 'No turn on red', 'regulatory--no-turn-on-red--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (854, 'No turn on red', 'regulatory--no-turn-on-red--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (855, 'No turns', 'regulatory--no-turns--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (856, 'No turns', 'regulatory--no-turns--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (857, 'No two stage right turn for mopeds', 'regulatory--no-two-stage-right-turn-for-mopeds--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (858, 'No u turn', 'regulatory--no-u-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (859, 'No u turn', 'regulatory--no-u-turn--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (860, 'No u turn', 'regulatory--no-u-turn--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (861, 'No vehicles carrying dangerous goods', 'regulatory--no-vehicles-carrying-dangerous-goods--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (862, 'No vehicles carrying dangerous goods', 'regulatory--no-vehicles-carrying-dangerous-goods--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (863, 'No vehicles carrying dangerous goods', 'regulatory--no-vehicles-carrying-dangerous-goods--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (864, 'No vehicles carrying dangerous goods', 'regulatory--no-vehicles-carrying-dangerous-goods--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (865, 'No vehicles carrying dangerous water pollutants', 'regulatory--no-vehicles-carrying-dangerous-water-pollutants--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (866, 'No vehicles carrying dangerous water pollutants', 'regulatory--no-vehicles-carrying-dangerous-water-pollutants--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (867, 'No vehicles carrying explosives', 'regulatory--no-vehicles-carrying-explosives--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (868, 'No vehicles carrying explosives or dangerous water pollutants', 'regulatory--no-vehicles-carrying-explosives-or-dangerous-water-pollutants--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (869, 'One way left', 'regulatory--one-way-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (870, 'One way left', 'regulatory--one-way-left--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (871, 'One way left', 'regulatory--one-way-left--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (872, 'One way right', 'regulatory--one-way-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (873, 'One way right', 'regulatory--one-way-right--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (874, 'One way right', 'regulatory--one-way-right--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (875, 'One way straight', 'regulatory--one-way-straight--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (876, 'One way straight', 'regulatory--one-way-straight--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (877, 'Parking fee station', 'regulatory--parking-fee-station--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (878, 'Parking restrictions', 'regulatory--parking-restrictions--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (879, 'Parking restrictions', 'regulatory--parking-restrictions--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (880, 'Parking restrictions', 'regulatory--parking-restrictions--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (881, 'Pass on either side', 'regulatory--pass-on-either-side--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (882, 'Pass on either side', 'regulatory--pass-on-either-side--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (883, 'Pass on either side', 'regulatory--pass-on-either-side--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (884, 'Pass with care', 'regulatory--pass-with-care--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (885, 'Passing lane ahead', 'regulatory--passing-lane-ahead--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (886, 'Pedestrians bicycles permitted', 'regulatory--pedestrians-bicycles-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (887, 'Pedestrians keep left', 'regulatory--pedestrians-keep-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (888, 'Pedestrians only', 'regulatory--pedestrians-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (889, 'Pedestrians only', 'regulatory--pedestrians-only--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (890, 'Pedestrians only', 'regulatory--pedestrians-only--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (891, 'Pedestrians priority zone', 'regulatory--pedestrians-priority-zone--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (892, 'Pedestrians push button', 'regulatory--pedestrians-push-button--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (893, 'Pedestrians push button', 'regulatory--pedestrians-push-button--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (894, 'Priority over oncoming vehicles', 'regulatory--priority-over-oncoming-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (895, 'Priority over oncoming vehicles', 'regulatory--priority-over-oncoming-vehicles--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (896, 'Priority road', 'regulatory--priority-road--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (897, 'Priority road', 'regulatory--priority-road--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (898, 'Radar enforced', 'regulatory--radar-enforced--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (899, 'Reserved parking', 'regulatory--reserved-parking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (900, 'Reversible lanes', 'regulatory--reversible-lanes--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (901, 'Reversible lanes', 'regulatory--reversible-lanes--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (902, 'Road closed', 'regulatory--road-closed--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (903, 'Road closed', 'regulatory--road-closed--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (904, 'Road closed to vehicles', 'regulatory--road-closed-to-vehicles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (905, 'Road closed to vehicles', 'regulatory--road-closed-to-vehicles--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (906, 'Roundabout', 'regulatory--roundabout--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (907, 'Roundabout', 'regulatory--roundabout--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (908, 'Roundabout', 'regulatory--roundabout--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (909, 'Shared path bicycles and pedestrians', 'regulatory--shared-path-bicycles-and-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (910, 'Shared path pedestrians and bicycles', 'regulatory--shared-path-pedestrians-and-bicycles--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (911, 'Sidewalk closed', 'regulatory--sidewalk-closed--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (912, 'Slanted parking', 'regulatory--slanted-parking--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (913, 'Snow chains', 'regulatory--snow-chains--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (914, 'Snow chains', 'regulatory--snow-chains--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (915, 'Snow chains', 'regulatory--snow-chains--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (916, 'Snowmobiles only', 'regulatory--snowmobiles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (917, 'Snowmobiles permitted', 'regulatory--snowmobiles-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (918, 'Speed limit zone', 'regulatory--speed-limit-zone--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (919, 'Speeding fines increased', 'regulatory--speeding-fines-increased--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (920, 'State route', 'regulatory--state-route--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (921, 'Stay in lane', 'regulatory--stay-in-lane--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (922, 'Stop', 'regulatory--stop--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (923, 'Stop', 'regulatory--stop--g10.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (924, 'Stop', 'regulatory--stop--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (925, 'Stop', 'regulatory--stop--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (926, 'Stop', 'regulatory--stop--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (927, 'Stop', 'regulatory--stop--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (928, 'Stop', 'regulatory--stop--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (929, 'Stop', 'regulatory--stop--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (930, 'Stop', 'regulatory--stop--g8.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (931, 'Stop', 'regulatory--stop--g9.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (932, 'Stop here on red or flashing light', 'regulatory--stop-here-on-red-or-flashing-light--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (933, 'Stop here on red or flashing light', 'regulatory--stop-here-on-red-or-flashing-light--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (934, 'Stop signals', 'regulatory--stop-signals--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (935, 'Stop signals', 'regulatory--stop-signals--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (936, 'Tanks only', 'regulatory--tanks-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (937, 'Taxi only', 'regulatory--taxi-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (938, 'Text', 'regulatory--text--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (939, 'Text', 'regulatory--text--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (940, 'Toll pass only', 'regulatory--toll-pass-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (941, 'Tractors only', 'regulatory--tractors-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (942, 'Traffic signal photo enforced', 'regulatory--traffic-signal-photo-enforced--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (943, 'Trams and buses only', 'regulatory--trams-and-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (944, 'Trams only', 'regulatory--trams-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (945, 'Triple lanes', 'regulatory--triple-lanes--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (946, 'Triple lanes go straight center lane', 'regulatory--triple-lanes-go-straight-center-lane--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (947, 'Triple lanes turn left center lane', 'regulatory--triple-lanes-turn-left-center-lane--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (948, 'Triple lanes turn right center lane', 'regulatory--triple-lanes-turn-right-center-lane--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (949, 'Truck route', 'regulatory--truck-route--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (950, 'Truck speed limit 10', 'regulatory--truck-speed-limit-10--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (951, 'Truck speed limit 15', 'regulatory--truck-speed-limit-15--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (952, 'Truck speed limit 20', 'regulatory--truck-speed-limit-20--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (953, 'Truck speed limit 25', 'regulatory--truck-speed-limit-25--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (954, 'Truck speed limit 30', 'regulatory--truck-speed-limit-30--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (955, 'Truck speed limit 35', 'regulatory--truck-speed-limit-35--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (956, 'Truck speed limit 40', 'regulatory--truck-speed-limit-40--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (957, 'Truck speed limit 45', 'regulatory--truck-speed-limit-45--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (958, 'Truck speed limit 5', 'regulatory--truck-speed-limit-5--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (959, 'Truck speed limit 50', 'regulatory--truck-speed-limit-50--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (960, 'Truck speed limit 55', 'regulatory--truck-speed-limit-55--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (961, 'Truck speed limit 60', 'regulatory--truck-speed-limit-60--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (962, 'Truck speed limit 65', 'regulatory--truck-speed-limit-65--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (963, 'Truck speed limit 70', 'regulatory--truck-speed-limit-70--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (964, 'Truck speed limit 75', 'regulatory--truck-speed-limit-75--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (965, 'Truck speed limit 80', 'regulatory--truck-speed-limit-80--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (966, 'Truck speed limit 85', 'regulatory--truck-speed-limit-85--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (967, 'Trucks and buses only', 'regulatory--trucks-and-buses-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (968, 'Trucks on right', 'regulatory--trucks-on-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (969, 'Trucks only', 'regulatory--trucks-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (970, 'Turn left', 'regulatory--turn-left--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (971, 'Turn left', 'regulatory--turn-left--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (972, 'Turn left', 'regulatory--turn-left--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (973, 'Turn left ahead', 'regulatory--turn-left-ahead--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (974, 'Turn left ahead', 'regulatory--turn-left-ahead--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (975, 'Turn left or right', 'regulatory--turn-left-or-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (976, 'Turn left or right', 'regulatory--turn-left-or-right--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (977, 'Turn left or right', 'regulatory--turn-left-or-right--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (978, 'Turn left or u turn', 'regulatory--turn-left-or-u-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (979, 'Turn right', 'regulatory--turn-right--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (980, 'Turn right', 'regulatory--turn-right--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (981, 'Turn right', 'regulatory--turn-right--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (982, 'Turn right ahead', 'regulatory--turn-right-ahead--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (983, 'Turn right ahead', 'regulatory--turn-right-ahead--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (984, 'Turning vehicles yield to pedestrians', 'regulatory--turning-vehicles-yield-to-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (985, 'Two stage right turn for mopeds', 'regulatory--two-stage-right-turn-for-mopeds--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (986, 'Two way', 'regulatory--two-way--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (987, 'U turn', 'regulatory--u-turn--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (988, 'U turn', 'regulatory--u-turn--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (989, 'U turn', 'regulatory--u-turn--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (990, 'Use crosswalk', 'regulatory--use-crosswalk--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (991, 'Vehicles carrying dangerous goods only', 'regulatory--vehicles-carrying-dangerous-goods-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (992, 'Vehicles carrying dangerous goods permitted', 'regulatory--vehicles-carrying-dangerous-goods-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (993, 'Vehicles carrying explosives only', 'regulatory--vehicles-carrying-explosives-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (994, 'Vehicles carrying hazardous goods permitted', 'regulatory--vehicles-carrying-hazardous-goods-permitted--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (995, 'Vehicles only', 'regulatory--vehicles-only--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (996, 'Wear seat belt', 'regulatory--wear-seat-belt--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (997, 'Wear seat belt', 'regulatory--wear-seat-belt--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (998, 'Wear seat belt', 'regulatory--wear-seat-belt--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (999, 'Weight limit', 'regulatory--weight-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1000, 'Weight limit', 'regulatory--weight-limit--g2.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1001, 'Weight limit', 'regulatory--weight-limit--g3.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1002, 'Weight limit', 'regulatory--weight-limit--g4.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1003, 'Weight limit', 'regulatory--weight-limit--g5.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1004, 'Weight limit', 'regulatory--weight-limit--g6.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1005, 'Weight limit', 'regulatory--weight-limit--g7.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1006, 'Weight limit per axle', 'regulatory--weight-limit-per-axle--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1007, 'Weight limit per tandem axle', 'regulatory--weight-limit-per-tandem-axle--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1008, 'Weight limit with trucks', 'regulatory--weight-limit-with-trucks--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1009, 'Width limit', 'regulatory--width-limit--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1010, 'Wrong way', 'regulatory--wrong-way--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1011, 'Yield', 'regulatory--yield--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1012, 'Yield or stop for pedestrians', 'regulatory--yield-or-stop-for-pedestrians--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1013, 'Your speed', 'regulatory--your-speed--g1.svg', 'regulatory');
INSERT INTO public.road_signs VALUES (1014, 'Accident area', 'warning--accident-area--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1015, 'Accident area', 'warning--accident-area--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1016, 'Accident area', 'warning--accident-area--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1017, 'Accident area', 'warning--accident-area--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1018, 'Accident area', 'warning--accident-area--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1019, 'Accident area', 'warning--accident-area--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1020, 'Accident area', 'warning--accident-area--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1021, 'Accident area', 'warning--accident-area--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1022, 'Added lane from entering roadway', 'warning--added-lane-from-entering-roadway--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1023, 'Added lane from entering roadway', 'warning--added-lane-from-entering-roadway--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1024, 'Added lane left', 'warning--added-lane-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1025, 'Added lane right', 'warning--added-lane-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1026, 'Animal drawn vehicles', 'warning--animal-drawn-vehicles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1027, 'Arch bridge', 'warning--arch-bridge--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1028, 'Atv and snowmobiles', 'warning--atv-and-snowmobiles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1029, 'Atv crossing', 'warning--atv-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1030, 'Atv crossing', 'warning--atv-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1031, 'Axle restriction', 'warning--axle-restriction--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1032, 'Bear crossing', 'warning--bear-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1033, 'Bear crossing', 'warning--bear-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1034, 'Bicycles and others', 'warning--bicycles-and-others--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1035, 'Bicycles caution on rail tracks', 'warning--bicycles-caution-on-rail-tracks--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1036, 'Bicycles crossing', 'warning--bicycles-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1037, 'Bicycles crossing', 'warning--bicycles-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1038, 'Bicycles crossing', 'warning--bicycles-crossing--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1039, 'Bicycles crossing', 'warning--bicycles-crossing--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1040, 'Bollard', 'warning--bollard--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1041, 'Bridge', 'warning--bridge--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1042, 'Bridge', 'warning--bridge--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1043, 'Bus stop ahead', 'warning--bus-stop-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1044, 'Bus stop ahead', 'warning--bus-stop-ahead--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1045, 'Bus stop ahead', 'warning--bus-stop-ahead--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1046, 'Camel crossing', 'warning--camel-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1047, 'Camel crossing', 'warning--camel-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1048, 'Camera', 'warning--camera--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1049, 'Camera', 'warning--camera--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1050, 'Carts', 'warning--carts--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1051, 'Carts', 'warning--carts--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1052, 'Checkpoint', 'warning--checkpoint--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1053, 'Children', 'warning--children--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1054, 'Children', 'warning--children--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1055, 'Children', 'warning--children--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1056, 'Children', 'warning--children--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1057, 'Children', 'warning--children--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1058, 'Cliff', 'warning--cliff--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1060, 'Closed lane in triple lanes', 'warning--closed-lane-in-triple-lanes--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1061, 'Closed lane in triple lanes', 'warning--closed-lane-in-triple-lanes--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1062, 'Construction ahead', 'warning--construction-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1063, 'Crossroads', 'warning--crossroads--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1064, 'Crossroads', 'warning--crossroads--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1065, 'Crossroads', 'warning--crossroads--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1066, 'Crossroads', 'warning--crossroads--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1067, 'Crossroads', 'warning--crossroads--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1068, 'Crossroads', 'warning--crossroads--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1069, 'Crossroads with priority to the right', 'warning--crossroads-with-priority-to-the-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1070, 'Curve left', 'warning--curve-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1071, 'Curve left', 'warning--curve-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1072, 'Curve left', 'warning--curve-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1073, 'Curve left with junction', 'warning--curve-left-with-junction--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1074, 'Curve out intersection left', 'warning--curve-out-intersection-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1075, 'Curve out intersection right', 'warning--curve-out-intersection-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1076, 'Curve right', 'warning--curve-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1077, 'Curve right', 'warning--curve-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1078, 'Curve right', 'warning--curve-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1079, 'Curve right with junction', 'warning--curve-right-with-junction--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1080, 'Dangerous crosswinds left', 'warning--dangerous-crosswinds-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1081, 'Dangerous crosswinds left', 'warning--dangerous-crosswinds-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1082, 'Dangerous crosswinds left', 'warning--dangerous-crosswinds-left--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1083, 'Dangerous crosswinds right', 'warning--dangerous-crosswinds-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1084, 'Dangerous crosswinds right', 'warning--dangerous-crosswinds-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1085, 'Dangerous crosswinds right', 'warning--dangerous-crosswinds-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1086, 'Dangerous crosswinds right', 'warning--dangerous-crosswinds-right--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1087, 'Dead end', 'warning--dead-end--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1088, 'Dead end', 'warning--dead-end--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1089, 'Dead end', 'warning--dead-end--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1090, 'Dead end go left', 'warning--dead-end-go-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1091, 'Dead end go right', 'warning--dead-end-go-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1092, 'Descent or climbing lanes in triple lanes', 'warning--descent-or-climbing-lanes-in-triple-lanes--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1093, 'Detour ahead', 'warning--detour-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1094, 'Detour or construction ahead', 'warning--detour-or-construction-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1095, 'Dip', 'warning--dip--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1096, 'Dip', 'warning--dip--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1097, 'Disabled persons crossing', 'warning--disabled-persons-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1098, 'Disabled persons crossing', 'warning--disabled-persons-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1099, 'Divided highway', 'warning--divided-highway--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1100, 'Divided highway', 'warning--divided-highway--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1101, 'Divided highway', 'warning--divided-highway--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1102, 'Divided highway', 'warning--divided-highway--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1103, 'Divided highway', 'warning--divided-highway--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1104, 'Divided highway', 'warning--divided-highway--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1105, 'Divided highway', 'warning--divided-highway--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1106, 'Divided highway', 'warning--divided-highway--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1107, 'Divided highway', 'warning--divided-highway--g9.svg', 'warning');
INSERT INTO public.road_signs VALUES (1108, 'Divided highway ends', 'warning--divided-highway-ends--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1109, 'Divided highway ends', 'warning--divided-highway-ends--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1110, 'Divided highway ends', 'warning--divided-highway-ends--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1111, 'Divided highway ends', 'warning--divided-highway-ends--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1112, 'Divided highway on left', 'warning--divided-highway-on-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1113, 'Divided highway on left', 'warning--divided-highway-on-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1114, 'Divided highway on right', 'warning--divided-highway-on-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1115, 'Divided highway on right', 'warning--divided-highway-on-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1116, 'Divided highway to left', 'warning--divided-highway-to-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1117, 'Divided highway to right', 'warning--divided-highway-to-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1118, 'Domestic animals', 'warning--domestic-animals--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1119, 'Domestic animals', 'warning--domestic-animals--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1120, 'Domestic animals', 'warning--domestic-animals--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1121, 'Domestic animals', 'warning--domestic-animals--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1122, 'Domestic animals', 'warning--domestic-animals--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1123, 'Domestic animals', 'warning--domestic-animals--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1124, 'Domestic animals', 'warning--domestic-animals--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1125, 'Domestic animals', 'warning--domestic-animals--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1126, 'Double curve first left', 'warning--double-curve-first-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1127, 'Double curve first left', 'warning--double-curve-first-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1128, 'Double curve first right', 'warning--double-curve-first-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1129, 'Double curve first right', 'warning--double-curve-first-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1130, 'Double descent', 'warning--double-descent--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1131, 'Double reverse curve left', 'warning--double-reverse-curve-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1132, 'Double reverse curve left', 'warning--double-reverse-curve-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1133, 'Double reverse curve right', 'warning--double-reverse-curve-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1134, 'Double reverse curve right', 'warning--double-reverse-curve-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1135, 'Double side roads left', 'warning--double-side-roads-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1136, 'Double side roads left', 'warning--double-side-roads-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1137, 'Double side roads right', 'warning--double-side-roads-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1138, 'Double side roads right', 'warning--double-side-roads-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1139, 'Double turn first left', 'warning--double-turn-first-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1140, 'Double turn first right', 'warning--double-turn-first-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1141, 'Dual lanes all directions on left', 'warning--dual-lanes-all-directions-on-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1142, 'Dual lanes all directions on right', 'warning--dual-lanes-all-directions-on-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1143, 'Dual lanes go straight or turn left', 'warning--dual-lanes-go-straight-or-turn-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1144, 'Dual lanes go straight or turn right', 'warning--dual-lanes-go-straight-or-turn-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1145, 'Dual lanes left turn', 'warning--dual-lanes-left-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1146, 'Dual lanes left turn or go straight', 'warning--dual-lanes-left-turn-or-go-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1147, 'Dual lanes right turn', 'warning--dual-lanes-right-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1148, 'Dual lanes right turn or go straight', 'warning--dual-lanes-right-turn-or-go-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1149, 'Dual lanes turn left', 'warning--dual-lanes-turn-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1150, 'Dual lanes turn left or right', 'warning--dual-lanes-turn-left-or-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1151, 'Dual lanes turn left or right', 'warning--dual-lanes-turn-left-or-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1152, 'Dual lanes turn left or right', 'warning--dual-lanes-turn-left-or-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1153, 'Dual lanes turn left or right', 'warning--dual-lanes-turn-left-or-right--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1154, 'Dual lanes turn right', 'warning--dual-lanes-turn-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1155, 'Dual path cyclists and pedestrians', 'warning--dual-path-cyclists-and-pedestrians--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1156, 'Electricity', 'warning--electricity--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1157, 'Electricity', 'warning--electricity--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1158, 'Elephant crossing', 'warning--elephant-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1159, 'Emergency vehicles', 'warning--emergency-vehicles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1160, 'Emu crossing', 'warning--emu-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1161, 'Emu crossing', 'warning--emu-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1162, 'Entering roadway merge', 'warning--entering-roadway-merge--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1163, 'Entering roadway merge', 'warning--entering-roadway-merge--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1164, 'Equestrians crossing', 'warning--equestrians-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1165, 'Equestrians crossing', 'warning--equestrians-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1166, 'Expressway', 'warning--expressway--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1167, 'Falling rocks or debris left', 'warning--falling-rocks-or-debris-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1168, 'Falling rocks or debris left', 'warning--falling-rocks-or-debris-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1169, 'Falling rocks or debris left', 'warning--falling-rocks-or-debris-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1170, 'Falling rocks or debris left', 'warning--falling-rocks-or-debris-left--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1171, 'Falling rocks or debris right', 'warning--falling-rocks-or-debris-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1172, 'Falling rocks or debris right', 'warning--falling-rocks-or-debris-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1173, 'Falling rocks or debris right', 'warning--falling-rocks-or-debris-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1174, 'Falling rocks or debris right', 'warning--falling-rocks-or-debris-right--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1175, 'Ferry', 'warning--ferry--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1176, 'Flaggers in road', 'warning--flaggers-in-road--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1177, 'Flaggers in road', 'warning--flaggers-in-road--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1178, 'Foggy road', 'warning--foggy-road--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1179, 'Foggy road', 'warning--foggy-road--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1180, 'Ford', 'warning--ford--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1181, 'Forest', 'warning--forest--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1182, 'Fresh oil', 'warning--fresh-oil--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1183, 'Frog crossing', 'warning--frog-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1184, 'Gate', 'warning--gate--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1185, 'Gate', 'warning--gate--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1186, 'Gate left', 'warning--gate-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1187, 'Gate right', 'warning--gate-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1188, 'Go left', 'warning--go-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1189, 'Go right', 'warning--go-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1190, 'Golf carts crossing', 'warning--golf-carts-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1191, 'Gravel road surface', 'warning--gravel-road-surface--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1192, 'Hairpin curve left', 'warning--hairpin-curve-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1193, 'Hairpin curve left', 'warning--hairpin-curve-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1194, 'Hairpin curve left', 'warning--hairpin-curve-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1195, 'Hairpin curve right', 'warning--hairpin-curve-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1196, 'Hairpin curve right', 'warning--hairpin-curve-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1197, 'Height restriction', 'warning--height-restriction--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1198, 'Height restriction', 'warning--height-restriction--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1199, 'Height restriction', 'warning--height-restriction--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1200, 'Height restriction', 'warning--height-restriction--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1201, 'Horizontal alignment left', 'warning--horizontal-alignment-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1202, 'Horizontal alignment left', 'warning--horizontal-alignment-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1203, 'Horizontal alignment right', 'warning--horizontal-alignment-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1204, 'Horizontal alignment right', 'warning--horizontal-alignment-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1205, 'Horse crossing', 'warning--horse-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1206, 'Icy road', 'warning--icy-road--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1207, 'Junction with a side road acute left', 'warning--junction-with-a-side-road-acute-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1208, 'Junction with a side road acute left', 'warning--junction-with-a-side-road-acute-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1209, 'Junction with a side road acute right', 'warning--junction-with-a-side-road-acute-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1210, 'Junction with a side road acute right', 'warning--junction-with-a-side-road-acute-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1211, 'Junction with a side road perpendicular left', 'warning--junction-with-a-side-road-perpendicular-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1212, 'Junction with a side road perpendicular left', 'warning--junction-with-a-side-road-perpendicular-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1213, 'Junction with a side road perpendicular left', 'warning--junction-with-a-side-road-perpendicular-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1214, 'Junction with a side road perpendicular left', 'warning--junction-with-a-side-road-perpendicular-left--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1215, 'Junction with a side road perpendicular right', 'warning--junction-with-a-side-road-perpendicular-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1297, 'Polar bear crossing', 'warning--polar-bear-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1216, 'Junction with a side road perpendicular right', 'warning--junction-with-a-side-road-perpendicular-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1217, 'Junction with a side road perpendicular right', 'warning--junction-with-a-side-road-perpendicular-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1218, 'Junction with a side road perpendicular right', 'warning--junction-with-a-side-road-perpendicular-right--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1219, 'Junction with merge from left', 'warning--junction-with-merge-from-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1220, 'Junction with merge from right', 'warning--junction-with-merge-from-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1221, 'Junction with side roads', 'warning--junction-with-side-roads--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1222, 'Kangaloo crossing', 'warning--kangaloo-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1223, 'Keep distance', 'warning--keep-distance--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1224, 'Keep left', 'warning--keep-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1225, 'Keep right', 'warning--keep-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1226, 'Kiwi crossing', 'warning--kiwi-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1227, 'Kiwi crossing', 'warning--kiwi-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1228, 'Koala crossing', 'warning--koala-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1229, 'Koala crossing', 'warning--koala-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1230, 'Koala crossing', 'warning--koala-crossing--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1231, 'Koala crossing', 'warning--koala-crossing--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1232, 'Lane closed in dual lanes left', 'warning--lane-closed-in-dual-lanes-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1233, 'Lane closed in dual lanes left', 'warning--lane-closed-in-dual-lanes-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1234, 'Lane closed in dual lanes right', 'warning--lane-closed-in-dual-lanes-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1235, 'Lane closed in dual lanes right', 'warning--lane-closed-in-dual-lanes-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1236, 'Length restriction', 'warning--length-restriction--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1237, 'Length restriction', 'warning--length-restriction--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1238, 'Light rail transit vehicles', 'warning--light-rail-transit-vehicles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1239, 'Limited lighting under trees', 'warning--limited-lighting-under-trees--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1240, 'Logging vehicles', 'warning--logging-vehicles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1241, 'Loop 270 degree', 'warning--loop-270-degree--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1242, 'Loop pretzel', 'warning--loop-pretzel--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1243, 'Loose road surface', 'warning--loose-road-surface--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1244, 'Loose road surface', 'warning--loose-road-surface--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1245, 'Loose road surface', 'warning--loose-road-surface--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1246, 'Loose road surface', 'warning--loose-road-surface--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1247, 'Low flying aircraft', 'warning--low-flying-aircraft--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1248, 'Low flying aircraft', 'warning--low-flying-aircraft--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1249, 'Low flying aircraft', 'warning--low-flying-aircraft--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1250, 'Low flying aircraft', 'warning--low-flying-aircraft--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1251, 'Low flying aircraft', 'warning--low-flying-aircraft--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1252, 'Low flying aircraft', 'warning--low-flying-aircraft--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1253, 'Low flying aircraft', 'warning--low-flying-aircraft--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1254, 'Low flying aircraft', 'warning--low-flying-aircraft--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1255, 'Low ground clearance', 'warning--low-ground-clearance--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1256, 'Low ground clearance', 'warning--low-ground-clearance--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1257, 'Low ground clearance', 'warning--low-ground-clearance--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1258, 'Monkey crossing', 'warning--monkey-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1259, 'Motorcycles crossing', 'warning--motorcycles-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1260, 'Narrow bridge', 'warning--narrow-bridge--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1261, 'Narrow bridge', 'warning--narrow-bridge--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1262, 'Narrow bridge', 'warning--narrow-bridge--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1263, 'No passing zone', 'warning--no-passing-zone--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1264, 'No passing zone', 'warning--no-passing-zone--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1265, 'Occupied lanes', 'warning--occupied-lanes--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1266, 'Offset roads', 'warning--offset-roads--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1267, 'Offset roads', 'warning--offset-roads--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1268, 'Offset roads', 'warning--offset-roads--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1269, 'Offset roads', 'warning--offset-roads--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1270, 'Opening or swing bridge', 'warning--opening-or-swing-bridge--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1271, 'Opening or swing bridge', 'warning--opening-or-swing-bridge--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1272, 'Other danger', 'warning--other-danger--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1273, 'Other danger', 'warning--other-danger--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1274, 'Other danger', 'warning--other-danger--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1275, 'Panda crossing', 'warning--panda-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1276, 'Pass left or right', 'warning--pass-left-or-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1277, 'Pass left or right', 'warning--pass-left-or-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1278, 'Pass left or right', 'warning--pass-left-or-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1279, 'Pavement ahead', 'warning--pavement-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1280, 'Pavement ends', 'warning--pavement-ends--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1281, 'Pavement ends', 'warning--pavement-ends--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1282, 'Pavement ends', 'warning--pavement-ends--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1283, 'Pavement ends', 'warning--pavement-ends--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1284, 'Pavement ends', 'warning--pavement-ends--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1285, 'Pedestrians crossing', 'warning--pedestrians-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1286, 'Pedestrians crossing', 'warning--pedestrians-crossing--g10.svg', 'warning');
INSERT INTO public.road_signs VALUES (1287, 'Pedestrians crossing', 'warning--pedestrians-crossing--g11.svg', 'warning');
INSERT INTO public.road_signs VALUES (1288, 'Pedestrians crossing', 'warning--pedestrians-crossing--g12.svg', 'warning');
INSERT INTO public.road_signs VALUES (1289, 'Pedestrians crossing', 'warning--pedestrians-crossing--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1290, 'Pedestrians crossing', 'warning--pedestrians-crossing--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1291, 'Pedestrians crossing', 'warning--pedestrians-crossing--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1292, 'Pedestrians crossing', 'warning--pedestrians-crossing--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1293, 'Pedestrians crossing', 'warning--pedestrians-crossing--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1294, 'Pedestrians crossing', 'warning--pedestrians-crossing--g9.svg', 'warning');
INSERT INTO public.road_signs VALUES (1295, 'Playground', 'warning--playground--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1296, 'Playground', 'warning--playground--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1298, 'Quay or river bank', 'warning--quay-or-river-bank--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1299, 'Quay or river bank', 'warning--quay-or-river-bank--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1300, 'Quay or river bank', 'warning--quay-or-river-bank--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1301, 'Quay or river bank', 'warning--quay-or-river-bank--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1302, 'Rabbit crossing', 'warning--rabbit-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1303, 'Raccoon crossing', 'warning--raccoon-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1304, 'Railroad crossing', 'warning--railroad-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1305, 'Railroad crossing', 'warning--railroad-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1306, 'Railroad crossing', 'warning--railroad-crossing--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1307, 'Railroad crossing', 'warning--railroad-crossing--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1308, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1309, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1310, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1311, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1312, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1313, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1314, 'Railroad crossing with barriers', 'warning--railroad-crossing-with-barriers--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1315, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1316, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1317, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1318, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1319, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1320, 'Railroad crossing without barriers', 'warning--railroad-crossing-without-barriers--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1321, 'Railroad intersection', 'warning--railroad-intersection--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1322, 'Railroad intersection', 'warning--railroad-intersection--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1323, 'Railroad intersection', 'warning--railroad-intersection--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1324, 'Railroad intersection', 'warning--railroad-intersection--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1325, 'Railroad intersection', 'warning--railroad-intersection--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1326, 'Railroad intersection', 'warning--railroad-intersection--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1327, 'Railroad intersection', 'warning--railroad-intersection--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1328, 'Railroad intersection', 'warning--railroad-intersection--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1329, 'Railroad intersection', 'warning--railroad-intersection--g9.svg', 'warning');
INSERT INTO public.road_signs VALUES (1330, 'Ramp closed', 'warning--ramp-closed--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1331, 'Reduced maximum speed limit', 'warning--reduced-maximum-speed-limit--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1332, 'Reserved lane', 'warning--reserved-lane--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1333, 'Restricted zone', 'warning--restricted-zone--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1334, 'Reversible lanes', 'warning--reversible-lanes--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1335, 'Reversible lanes', 'warning--reversible-lanes--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1336, 'Rickshaws crossing', 'warning--rickshaws-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1337, 'Road blocks', 'warning--road-blocks--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1338, 'Road bump', 'warning--road-bump--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1339, 'Road bump', 'warning--road-bump--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1340, 'Road bump', 'warning--road-bump--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1341, 'Road bump with speed limit', 'warning--road-bump-with-speed-limit--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1342, 'Road closed', 'warning--road-closed--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1343, 'Road narrows', 'warning--road-narrows--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1344, 'Road narrows', 'warning--road-narrows--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1345, 'Road narrows left', 'warning--road-narrows-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1346, 'Road narrows left', 'warning--road-narrows-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1347, 'Road narrows left ahead', 'warning--road-narrows-left-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1348, 'Road narrows right', 'warning--road-narrows-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1349, 'Road narrows right', 'warning--road-narrows-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1350, 'Road narrows right ahead', 'warning--road-narrows-right-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1351, 'Road toll ahead', 'warning--road-toll-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1352, 'Road widens', 'warning--road-widens--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1353, 'Road widens left', 'warning--road-widens-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1354, 'Road widens right', 'warning--road-widens-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1355, 'Roadworks', 'warning--roadworks--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1356, 'Roadworks', 'warning--roadworks--g10.svg', 'warning');
INSERT INTO public.road_signs VALUES (1357, 'Roadworks', 'warning--roadworks--g11.svg', 'warning');
INSERT INTO public.road_signs VALUES (1358, 'Roadworks', 'warning--roadworks--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1359, 'Roadworks', 'warning--roadworks--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1360, 'Roadworks', 'warning--roadworks--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1361, 'Roadworks', 'warning--roadworks--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1362, 'Roadworks', 'warning--roadworks--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1363, 'Roadworks', 'warning--roadworks--g9.svg', 'warning');
INSERT INTO public.road_signs VALUES (1364, 'Roadworks go left or straight', 'warning--roadworks-go-left-or-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1365, 'Roadworks go right or straight', 'warning--roadworks-go-right-or-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1366, 'Roundabout', 'warning--roundabout--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1367, 'Roundabout', 'warning--roundabout--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1368, 'Roundabout', 'warning--roundabout--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1369, 'Roundabout', 'warning--roundabout--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1370, 'Roundabout', 'warning--roundabout--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1371, 'Roundabout', 'warning--roundabout--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1372, 'Roundabout', 'warning--roundabout--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1373, 'Ruts', 'warning--ruts--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1374, 'Sand', 'warning--sand--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1375, 'Sand drift', 'warning--sand-drift--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1376, 'School zone', 'warning--school-zone--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1377, 'Severe weather', 'warning--severe-weather--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1378, 'Shared lane motorcycles bicycles', 'warning--shared-lane-motorcycles-bicycles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1379, 'Sharp turn', 'warning--sharp-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1380, 'Single reverse curve', 'warning--single-reverse-curve--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1381, 'Skewed t roads left', 'warning--skewed-t-roads-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1382, 'Skewed t roads left', 'warning--skewed-t-roads-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1383, 'Skewed t roads left', 'warning--skewed-t-roads-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1384, 'Skewed t roads right', 'warning--skewed-t-roads-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1385, 'Skewed t roads right', 'warning--skewed-t-roads-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1386, 'Skewed t roads right', 'warning--skewed-t-roads-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1387, 'Skiers', 'warning--skiers--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1388, 'Skiers', 'warning--skiers--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1389, 'Skiers', 'warning--skiers--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1390, 'Slippery bicycles', 'warning--slippery-bicycles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1391, 'Slippery motorcycles', 'warning--slippery-motorcycles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1392, 'Slippery motorcycles', 'warning--slippery-motorcycles--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1393, 'Slippery road surface', 'warning--slippery-road-surface--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1394, 'Slippery road surface', 'warning--slippery-road-surface--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1395, 'Slow', 'warning--slow--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1396, 'Snow tractors', 'warning--snow-tractors--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1397, 'Snowmobiles', 'warning--snowmobiles--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1398, 'Snowmobiles', 'warning--snowmobiles--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1399, 'Snowmobiles', 'warning--snowmobiles--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1400, 'Snowmobiles and others', 'warning--snowmobiles-and-others--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1401, 'Soft road surface', 'warning--soft-road-surface--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1402, 'Soft road surface', 'warning--soft-road-surface--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1403, 'Soft shoulder', 'warning--soft-shoulder--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1404, 'Soft shoulder', 'warning--soft-shoulder--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1405, 'Soft shoulder', 'warning--soft-shoulder--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1406, 'Soft shoulder', 'warning--soft-shoulder--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1407, 'Speed camera', 'warning--speed-camera--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1408, 'Steep ascent', 'warning--steep-ascent--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1409, 'Steep ascent', 'warning--steep-ascent--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1410, 'Steep ascent', 'warning--steep-ascent--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1411, 'Steep ascent', 'warning--steep-ascent--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1412, 'Steep ascent and descent', 'warning--steep-ascent-and-descent--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1413, 'Steep descent', 'warning--steep-descent--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1414, 'Steep descent', 'warning--steep-descent--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1415, 'Steep descent', 'warning--steep-descent--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1416, 'Steep descent', 'warning--steep-descent--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1417, 'Steep descent', 'warning--steep-descent--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1418, 'Steep descent', 'warning--steep-descent--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1419, 'Stop ahead', 'warning--stop-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1420, 'Stop ahead', 'warning--stop-ahead--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1421, 'Stop ahead', 'warning--stop-ahead--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1422, 'Stop ahead', 'warning--stop-ahead--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1423, 'Stop ahead', 'warning--stop-ahead--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1424, 'T roads', 'warning--t-roads--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1425, 'T roads', 'warning--t-roads--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1426, 'Tanks crossing', 'warning--tanks-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1427, 'Tanks crossing', 'warning--tanks-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1428, 'Texts', 'warning--texts--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1429, 'Texts', 'warning--texts--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1430, 'Texts', 'warning--texts--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1431, 'Towing', 'warning--towing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1432, 'Tractors', 'warning--tractors--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1433, 'Tractors', 'warning--tractors--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1434, 'Tractors', 'warning--tractors--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1435, 'Tractors', 'warning--tractors--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1436, 'Tractors', 'warning--tractors--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1437, 'Tractors', 'warning--tractors--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1438, 'Tractors', 'warning--tractors--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1439, 'Traffic merges at signalized intersections', 'warning--traffic-merges-at-signalized-intersections--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1440, 'Traffic merges left', 'warning--traffic-merges-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1441, 'Traffic merges left', 'warning--traffic-merges-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1442, 'Traffic merges left', 'warning--traffic-merges-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1443, 'Traffic merges left', 'warning--traffic-merges-left--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1444, 'Traffic merges left and right', 'warning--traffic-merges-left-and-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1445, 'Traffic merges left buses', 'warning--traffic-merges-left-buses--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1446, 'Traffic merges right', 'warning--traffic-merges-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1447, 'Traffic merges right', 'warning--traffic-merges-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1448, 'Traffic merges right', 'warning--traffic-merges-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1449, 'Traffic merges right buses', 'warning--traffic-merges-right-buses--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1450, 'Traffic queues likely', 'warning--traffic-queues-likely--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1451, 'Traffic queues likely', 'warning--traffic-queues-likely--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1452, 'Traffic queues likely', 'warning--traffic-queues-likely--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1453, 'Traffic queues likely', 'warning--traffic-queues-likely--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1454, 'Traffic queues likely', 'warning--traffic-queues-likely--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1455, 'Traffic signals', 'warning--traffic-signals--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1456, 'Traffic signals', 'warning--traffic-signals--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1457, 'Traffic signals', 'warning--traffic-signals--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1458, 'Traffic signals', 'warning--traffic-signals--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1459, 'Traffic signals', 'warning--traffic-signals--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1460, 'Traffic signals', 'warning--traffic-signals--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1461, 'Traffic slow', 'warning--traffic-slow--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1462, 'Trail crossing', 'warning--trail-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1463, 'Trail crossing', 'warning--trail-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1464, 'Trail crossing', 'warning--trail-crossing--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1465, 'Trail crossing', 'warning--trail-crossing--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1466, 'Trail crossing', 'warning--trail-crossing--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1467, 'Trail crossing', 'warning--trail-crossing--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1468, 'Trams crossing', 'warning--trams-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1469, 'Trams crossing', 'warning--trams-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1470, 'Triple curve left', 'warning--triple-curve-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1471, 'Triple curve right', 'warning--triple-curve-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1472, 'Triple lanes left turn', 'warning--triple-lanes-left-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1473, 'Triple lanes left turn or go straight', 'warning--triple-lanes-left-turn-or-go-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1474, 'Triple lanes right turn', 'warning--triple-lanes-right-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1475, 'Triple lanes right turn or go straight', 'warning--triple-lanes-right-turn-or-go-straight--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1476, 'Triple lanes with directions', 'warning--triple-lanes-with-directions--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1477, 'Triple reverse curve left', 'warning--triple-reverse-curve-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1478, 'Triple reverse curve right', 'warning--triple-reverse-curve-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1479, 'Trucks crossing', 'warning--trucks-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1480, 'Trucks crossing', 'warning--trucks-crossing--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1481, 'Trucks rollover', 'warning--trucks-rollover--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1482, 'Trucks rollover', 'warning--trucks-rollover--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1483, 'Trucks rollover', 'warning--trucks-rollover--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1484, 'Trucks rollover', 'warning--trucks-rollover--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1485, 'Trucks rollover', 'warning--trucks-rollover--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1486, 'Tunnel', 'warning--tunnel--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1487, 'Tunnel', 'warning--tunnel--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1488, 'Tunnel', 'warning--tunnel--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1489, 'Tunnel', 'warning--tunnel--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1490, 'Tunnel', 'warning--tunnel--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1491, 'Tunnel', 'warning--tunnel--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1492, 'Tunnel', 'warning--tunnel--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1493, 'Turn left', 'warning--turn-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1494, 'Turn left', 'warning--turn-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1495, 'Turn left', 'warning--turn-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1496, 'Turn left or right', 'warning--turn-left-or-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1497, 'Turn right', 'warning--turn-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1498, 'Turn right', 'warning--turn-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1499, 'Turn right', 'warning--turn-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1500, 'Two way traffic', 'warning--two-way-traffic--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1501, 'Two way traffic', 'warning--two-way-traffic--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1502, 'Two way traffic', 'warning--two-way-traffic--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1503, 'Two way traffic', 'warning--two-way-traffic--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1504, 'Two way traffic', 'warning--two-way-traffic--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1505, 'Two way traffic', 'warning--two-way-traffic--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1506, 'U turn', 'warning--u-turn--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1507, 'U turn', 'warning--u-turn--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1508, 'Uneven road', 'warning--uneven-road--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1509, 'Uneven road', 'warning--uneven-road--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1510, 'Uneven roads ahead', 'warning--uneven-roads-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1511, 'Vehicles and others', 'warning--vehicles-and-others--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1512, 'Vehicles crossing', 'warning--vehicles-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1513, 'Village', 'warning--village--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1514, 'Weight limit', 'warning--weight-limit--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1515, 'Weight limit per tandem axle', 'warning--weight-limit-per-tandem-axle--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1516, 'Width restriction', 'warning--width-restriction--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1517, 'Width restriction', 'warning--width-restriction--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1518, 'Width restriction', 'warning--width-restriction--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1519, 'Width restriction', 'warning--width-restriction--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1520, 'Wild animals', 'warning--wild-animals--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1521, 'Wild animals', 'warning--wild-animals--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1522, 'Wild animals', 'warning--wild-animals--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1523, 'Wild animals', 'warning--wild-animals--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1524, 'Wild animals', 'warning--wild-animals--g5.svg', 'warning');
INSERT INTO public.road_signs VALUES (1525, 'Wild animals', 'warning--wild-animals--g6.svg', 'warning');
INSERT INTO public.road_signs VALUES (1526, 'Wild animals', 'warning--wild-animals--g7.svg', 'warning');
INSERT INTO public.road_signs VALUES (1527, 'Wild animals', 'warning--wild-animals--g8.svg', 'warning');
INSERT INTO public.road_signs VALUES (1528, 'Wind', 'warning--wind--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1529, 'Winding road', 'warning--winding-road--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1530, 'Winding road first left', 'warning--winding-road-first-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1531, 'Winding road first left', 'warning--winding-road-first-left--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1532, 'Winding road first left', 'warning--winding-road-first-left--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1533, 'Winding road first right', 'warning--winding-road-first-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1534, 'Winding road first right', 'warning--winding-road-first-right--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1535, 'Winding road first right', 'warning--winding-road-first-right--g3.svg', 'warning');
INSERT INTO public.road_signs VALUES (1536, 'Winding road first right', 'warning--winding-road-first-right--g4.svg', 'warning');
INSERT INTO public.road_signs VALUES (1537, 'Winding road to left', 'warning--winding-road-to-left--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1538, 'Winding road to right', 'warning--winding-road-to-right--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1539, 'Wombat crossing', 'warning--wombat-crossing--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1540, 'Y roads', 'warning--y-roads--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1541, 'Y roads', 'warning--y-roads--g2.svg', 'warning');
INSERT INTO public.road_signs VALUES (1542, 'Yield ahead', 'warning--yield-ahead--g1.svg', 'warning');
INSERT INTO public.road_signs VALUES (1543, 'Yield ahead', 'warning--yield-ahead--g3.svg', 'warning');


--
-- Data for Name: system_feedback; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.system_feedback VALUES (1, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'Y u g', 'R7ifif', 'Implemented', NULL, '2026-06-15 22:38:40.817675+03', 'Duct', NULL);
INSERT INTO public.system_feedback VALUES (2, 'ea6a1374-e277-43d5-9c0f-d6ca3ce69a52', 'UI', 'w435edtrfy', 'Pending', NULL, '2026-06-15 23:12:49.334929+03', 'ytfgjhbk', NULL);
INSERT INTO public.system_feedback VALUES (3, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'Bxgdhd', 'Bxbbdd', 'Pending', NULL, '2026-06-15 23:13:12.70342+03', 'Hsjdd', NULL);
INSERT INTO public.system_feedback VALUES (4, 'b4a419f5-eeb4-4d24-9bba-00bcddf98397', 'Xhdudjj', ',bxjxjcn', 'Pending', NULL, '2026-06-15 23:13:33.440336+03', 'Xhhddjj', NULL);


--
-- Data for Name: theory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (1, 'Driving Techniques', 'State how you can overtake another vehicle', '{"Slow, indicate, check clear, overtake, indicate left, keep side"}', '{"Speed up immediately","Overtake from left","Sound horn and overtake"}', 'Slow down, start indicating, check if clear, overtake, indicate left, keep to your side.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (2, 'Driving Techniques', 'You should check your blind spot before changing lanes. True or False?', '{True}', '{False}', 'True. Always check your blind spot as mirrors cannot show everything. Turn your head to check.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (3, 'Driving Techniques', 'What is the safe distance to drive from the car in front of you?', '{"1m per km/h, double for wet, 4x for ice (two-second rule)"}', '{"10 meters always","5 meters always","As close as possible"}', 'Allow 1 meter for each kilometer per hour, double for wet roads, four times for icy roads (two-second rule).');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (4, 'Driving Techniques', 'What is the correct way to brake in an emergency?', '{"Press firmly and progressively, keep pressed if ABS"}', '{"Pump brake pedal","Don''t use brake","Press clutch only"}', 'Press the brake firmly and progressively. If ABS is fitted, keep the pedal pressed; the system will prevent wheel lock.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (5, 'Driving Techniques', 'Why do we normally press down the clutch pedal while engaging gears?', '{"To disconnect gearbox from engine"}', '{"To stop the car","To accelerate","To brake"}', 'To disconnect the gearbox from the engine for smooth gear changes.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (6, 'Driving Techniques', 'What is defensive driving?', '{"Anticipating hazards and minimizing risk"}', '{"Aggressive driving",Racing,"Honking frequently"}', 'Defensive driving is anticipating potential hazards and driving in a way that minimizes risk, regardless of others'' actions.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (7, 'Driving Techniques', 'What do you do before getting out of the vehicle?', '{"Check side mirror or look over right shoulder"}', '{"Open door immediately","Sound horn","Turn off engine only"}', 'Check the side mirror or look over your right shoulder before opening the door.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (8, 'Driving Techniques', 'How do we hold the steering wheel clockwise?', '{"10 to 2 position or 1/4 to 3"}', '{"12 to 6 position","9 to 3 position","Any position"}', 'Hold the steering wheel at 10 to 2 position or quarter to 3 position for optimal control.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (9, 'Driving Techniques', 'Write down four DONTs of holding a steering wheel', '{"Do not crisscross hands","Do not hold with only one hand","Do not grip very firmly","Do not hold with elbows"}', '{}', 'Do not crisscross hands, hold with one hand only, grip too firmly, or hold with elbows.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (10, 'Driving Techniques', 'Which distance should you keep between two moving vehicles in town?', '{"See behind wheels or number plate of vehicle in front"}', '{"1 meter","10 meters","As close as possible"}', 'You should see the behind wheels or number plate of the vehicle in front.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (11, 'Special Conditions', 'How should you drive on slippery roads?', '{"Gentle movements, reduce speed, higher gears"}', '{"Drive normally","Brake hard","Speed up"}', 'Use gentle movements, reduce speed, increase following distance, avoid sudden braking or acceleration, and use higher gears.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (12, 'Special Conditions', 'What controls the speed of the vehicle during dark hours?', '{"The reach of your headlights"}', '{"Speed limit signs",Traffic,"Road surface"}', 'During dark hours, the speed of the vehicle is controlled by the reach of your headlights.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (13, 'Special Conditions', 'What four points does the code mention about carrying passengers on a two-wheeled motorbike?', '{"One passenger, secure seat, footrests, safety helmet"}', '{"No restrictions","Two passengers allowed","No passengers"}', 'Carry only one, secure fastening and proper seat, proper footrests, must wear approved safety helmet.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (14, 'Special Conditions', 'In what circumstances should one drive the vehicle wearing sunglasses?', '{"Not at night or poor visibility"}', '{"Always wear them","Only at night","Never wear them"}', 'Sunglasses should not be worn at night and when visibility is poor.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (15, 'Special Conditions', 'As a motorcyclist, you are required to ride with lights on always. True or False?', '{True}', '{False}', 'True - motorcyclists need lights on always to enable other road users to see them.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (16, 'Special Conditions', 'Apart from a safety helmet, what other things should be worn by a motorcyclist?', '{"Eye protectors, strong boots, gloves, protective clothing"}', '{"Only helmet","Sunglasses only","Nothing else needed"}', 'Eye protectors, strong boots, gloves, and protective clothing for falls.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (17, 'Special Conditions', 'When driving past animals, what would you do?', '{"Drive slowly, plenty of room, do not hoot"}', '{"Drive fast and hoot","Speed up","Flash lights"}', 'Drive slowly, give them plenty of room, and do not hoot to avoid startling them.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (18, 'Special Conditions', 'What is Aquaplaning?', '{"Water film between tires and road affecting steering/braking"}', '{"Tire overheating","Brake failure","Engine problem"}', 'Aquaplaning is when a film of water builds up between tires and road, affecting steering and braking.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (19, 'Special Conditions', 'What should you do when driving in heavy rain?', '{"Reduce speed, increase distance, use lights"}', '{"Drive faster","Turn off lights","No special action needed"}', 'Reduce speed, increase following distance, use headlights, and be aware of aquaplaning risk.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (20, 'Basic Road Rules', 'In Kenya, you must drive on the left side of the road. True or False?', '{True}', '{False}', 'True. Kenya follows left-hand traffic rules.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (21, 'Basic Road Rules', 'It is legal to drive in the right lane continuously on a multi-lane highway. True or False?', '{False}', '{True}', 'False. The right lane is for overtaking only. You should return to the left lane after overtaking.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (22, 'Basic Road Rules', 'What is the correct hand position on the steering wheel?', '{"At 9 and 3 o''clock positions"}', '{"At 6 o''clock position","At 12 o''clock position","One hand anywhere"}', 'At the 9 and 3 o''clock positions (or 10 and 2 o''clock), with thumbs on the rim.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (23, 'Basic Road Rules', 'What should you do if you miss your turn?', '{"Continue to next safe turning point"}', '{"Reverse immediately","Make a U-turn on the highway","Stop and ask for directions"}', 'Continue to the next safe place where you can turn around. Never reverse on a highway or make dangerous maneuvers.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (24, 'Basic Road Rules', 'Emergency vehicles with sirens have the right of way. True or False?', '{True}', '{False}', 'Emergency vehicles (ambulances, fire engines, police) with sirens must be given priority.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (25, 'Basic Road Rules', 'What should you do when approaching a blind corner?', '{"Slow down and stay on your side"}', '{"Speed up to get through quickly","Move to the center of the road","Honk continuously"}', 'Slow down, stay on your side of the road, and be prepared to stop if necessary.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (26, 'Basic Road Rules', 'What is the safe following distance in normal conditions?', '{"At least 2 seconds"}', '{"Less than 1 second","Exactly 5 meters","As close as possible"}', 'At least 2 seconds behind the vehicle in front, or sufficient distance to see the rear wheels of the vehicle ahead touching the road.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (27, 'Basic Road Rules', 'You can use your mobile phone while driving if you use hands-free. True or False?', '{False}', '{True}', 'False. Even hands-free phone use while driving is discouraged as it distracts attention.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (28, 'Basic Road Rules', 'When must you use your horn?', '{"To warn others when necessary"}', '{"Whenever you want","Never at all","Only in emergencies"}', 'To warn other road users of your presence when necessary, but not between 11:30 PM and 7:00 AM in built-up areas.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (29, 'Basic Road Rules', 'What do you look for when driving past stationary vehicles?', '{"Opening of door","Pedestrian crossing"}', '{"Vehicle color","License plate"}', 'Always check for opening doors and pedestrians crossing when passing parked vehicles.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (30, 'Driving Techniques', 'What is a three-point turn?', '{"Driving opposite direction using reverse and forward"}', '{"Turning at junction","Parking technique","Emergency stop"}', 'A three-point turn is to drive a vehicle facing the opposite direction using reverse and forward gears.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (31, 'Driving Techniques', 'What is the safest way to navigate a sharp curve?', '{"Slow before curve, look through it, accelerate gently on exit"}', '{"Speed up before curve","Brake on the curve","Coast through"}', 'Slow down before the curve, look through the curve where you want to go, and accelerate gently as you exit.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (32, 'Driving Techniques', 'When do you use the mirror when driving?', '{"When overtaking","Changing lane",Stopping}', '{"Only when reversing"}', 'Use mirrors when overtaking, changing lanes, or stopping to check surroundings.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (33, 'Special Conditions', 'You should use high-beam headlights in fog. True or False?', '{False}', '{True}', 'False. Use dipped headlights or fog lights in fog. High beams reflect off fog and reduce visibility.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (34, 'Driving Techniques', 'Coasting (driving in neutral) saves fuel. True or False?', '{False}', '{True}', 'False. Coasting reduces vehicle control and modern engines cut fuel supply when decelerating in gear, making it less efficient.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (35, 'Driving Techniques', 'What is coasting?', '{"Driving in neutral"}', '{"Driving downhill","Driving for long with one gear","Driving slowly"}', 'Coasting is driving a vehicle for a long distance with one gear engaged.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (36, 'Basic Road Rules', 'What is the rule of the road in Kenya?', '{"Keep left unless overtaking"}', '{"Keep right unless overtaking","Drive in the middle","Keep changing lanes"}', 'In Kenya, vehicles must keep to the left side of the road unless overtaking.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (37, 'Basic Road Rules', 'What does a broken white line in the center of the road mean?', '{"You may overtake if safe"}', '{"No overtaking allowed","Road work ahead","Speed limit zone"}', 'You may overtake if it is safe to do so and you have clear visibility.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (38, 'Basic Road Rules', 'How many eyes does a driver have?', '{"Three (Two natural and one artificial)"}', '{Two,Four,One}', 'A driver has three eyes - two natural eyes and one artificial eye (the rear-view mirror).');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (39, 'Basic Road Rules', 'How many wheels does a saloon car have?', '{"Five (Four moving and one spare)"}', '{Four,Six,Three}', 'A saloon car has five wheels total - four moving wheels and one spare wheel.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (40, 'Basic Road Rules', 'What is the meaning of a solid white line in the center of the road?', '{"No overtaking or crossing allowed"}', '{"You can overtake if clear","Parking is allowed","Slow traffic only"}', 'A solid white line means no overtaking or crossing to the other side is allowed.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (41, 'Lighting and Signals', 'Where should you NOT hoot?', '{"Near a hospital","Near a school","Near law courts","Where there is No Hooting sign"}', '{}', 'Hooting is prohibited near hospitals, schools, law courts, and areas with "No Hooting" signs to maintain peace.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (42, 'Lighting and Signals', 'What arm signal indicates slowing down or stopping?', '{"Arm down, palm back, moving up and down"}', '{"Arm up","Arm forward","Circular motion"}', 'Extend your right arm downwards with palm facing backward, moving it up and down.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (43, 'Lighting and Signals', 'When driving at night, when should you dip your headlights?', '{"Only for oncoming traffic","Oncoming traffic, following, well-lit roads, dawn/dusk, fog, junctions"}', '{"Never dip","Only in fog"}', 'When meeting oncoming traffic, following closely, on well-lit roads, at dawn/dusk, in fog/snow, approaching junctions.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (44, 'Lighting and Signals', 'Which mechanical signal should we put on after being involved in a road accident in the middle of the road?', '{"Hazard lights"}', '{"Left indicator","Right indicator","Reverse lights"}', 'Hazard lights to warn other traffic of the stopped vehicle.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (45, 'Lighting and Signals', 'What does a flashing amber light at a pedestrian crossing mean?', '{"Approach with caution"}', '{"Speed up","Stop immediately","Ignore it"}', 'Approach with caution and be prepared to give way to pedestrians crossing or waiting to cross.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (46, 'Lighting and Signals', 'Using fog lights in clear conditions is illegal. True or False?', '{True}', '{False}', 'True. Fog lights should only be used in fog, heavy rain, or when visibility is seriously reduced.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (47, 'Lighting and Signals', 'What time do you usually switch on the lights in the evening?', '{"6:30 PM parking lights, 6:45 PM headlights"}', '{"6:00 PM both","7:00 PM both","When completely dark"}', '6:30 PM for parking lights and 6:45 PM for headlights.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (48, 'Lighting and Signals', 'Reverse lights are white. True or False?', '{True}', '{False}', 'True. White reverse lights indicate that a vehicle is reversing or about to reverse.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (49, 'Lighting and Signals', 'What should you do if you are dazzled by the lights of an oncoming vehicle?', '{"Slow down and stop if necessary"}', '{"Speed up","Flash back","Close eyes"}', 'Slow down, stay on your side of the road, and be prepared to stop if necessary.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (50, 'Driving Techniques', 'What is the purpose of the MSM routine?', '{Mirror-Signal-Manoeuvre}', '{Music-Speed-Move,Move-Stop-Monitor,Map-Start-Move}', 'MSM (Mirror-Signal-Manoeuvre) is a routine to check mirrors, signal intentions, then execute the manoeuvre safely.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (51, 'Documents and Licensing', 'How often must commercial vehicles undergo inspection?', '{"Every 6 months"}', '{Annually,"Every 3 months","Not required"}', 'Commercial vehicles must undergo NTSA inspection every 6 months.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (52, 'Documents and Licensing', 'Name three documents which must be valid before you are allowed to drive', '{"Valid driving license","Valid insurance certificate","Valid vehicle inspection certificate","Vehicle registration book"}', '{}', 'Valid driving license, valid insurance certificate, and valid vehicle inspection certificate are required.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (53, 'Documents and Licensing', 'You must carry your driving license whenever you drive. True or False?', '{True}', '{False}', 'True. You must always have your driving license, insurance certificate, and vehicle inspection certificate when driving.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (54, 'Documents and Licensing', 'A PDL holder can carry passengers. True or False?', '{False}', '{True}', 'False. A Provisional Driving License (PDL) holder cannot carry passengers and must display "L" plates.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (55, 'Documents and Licensing', 'What does EAK on a driving license mean?', '{"East Africa Kenya"}', '{"East African Kingdom","Eastern Africa Kilifi","Emergency Alert Kenya"}', 'EAK means East Africa Kenya.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (56, 'Documents and Licensing', 'What happens if you drive without insurance?', '{"Fines, impoundment, license suspension"}', '{"Nothing happens","Just a warning","Small fine only"}', 'Driving without insurance is illegal and can result in fines, vehicle impoundment, and license suspension.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (57, 'Documents and Licensing', 'How long is a learner''s permit valid for?', '{"12 months"}', '{"6 months","24 months","18 months"}', 'A learner''s permit is valid for 12 months from the date of issue.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (58, 'Traffic Signs', 'If the traffic lights are green but you are stopped by a police officer, who should you obey?', '{"Police officer (under mandatory authority)"}', '{"Traffic light","Other drivers","Your judgment"}', 'Obey the police officer because they are under mandatory authority and override traffic signals.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (59, 'Traffic Signs', 'If you saw a red triangle on the road, what would it mean?', '{"Obstruction on road ahead"}', '{"Road works","School zone","Speed limit"}', 'That there is an obstruction on the road ahead - warning triangle.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (60, 'Traffic Signs', 'What does an amber traffic light mean?', '{"Stop if safe to do so"}', '{"Go faster","Proceed with caution","Turn left only"}', 'An amber light means stop if you can do so safely at the stop line.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (61, 'Traffic Signs', 'What do traffic lights showing green mean, except when?', '{"Vehicle from right or stopped by police"}', '{"When raining","When tired","Always go"}', 'Green means go, except when there is an oncoming vehicle from the right or when stopped by police.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (62, 'Traffic Signs', 'What is another name given to a Give Way sign?', '{Yield}', '{"Stop sign","Caution sign","Warning sign"}', 'The Give Way sign is also called a Yield sign.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (63, 'Traffic Signs', 'What does AMBER which keeps flushing every now and then in the traffic lights mean?', '{"Control yourself, proceed with caution"}', '{"Stop completely","Speed up","Turn around"}', 'Flashing amber means control yourself and proceed with caution.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (64, 'Traffic Signs', 'Why is a STOP sign octagonal and a YIELD sign triangular (inverted)?', '{"To recognize in snow conditions or poor visibility"}', '{"For decoration","International standard only","Random design"}', 'To be able to recognize them in snow conditions or poor visibility by their unique shapes.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (65, 'Vehicle Maintenance', 'How often should you check tyre pressure?', '{Weekly}', '{Monthly,Yearly,Never}', 'Check tyre pressure at least once a week and before long journeys.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (66, 'Vehicle Maintenance', 'What is the minimum legal tread depth for tyres?', '{1.6mm}', '{1.0mm,2.0mm,3.0mm}', 'The minimum legal tread depth is 1.6mm across the central three-quarters of the tyre.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (67, 'Vehicle Maintenance', 'What are the four important tools you have to carry when driving for a safari?', '{"Car jack","Spare wheel",Spotlight,"Fire extinguisher"}', '{}', 'Essential safari tools are car jack, spare wheel, spotlight, and fire extinguisher for emergencies.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (68, 'Vehicle Maintenance', 'What does the battery warning light indicate?', '{"Charging system problem"}', '{"Low fuel","Door open","Seatbelt warning"}', 'The battery warning light indicates a charging system problem. The alternator may not be charging the battery.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (69, 'Vehicle Maintenance', 'What should you do if your brakes fail while driving?', '{"Pump brake, engine braking, handbrake"}', '{"Continue driving","Turn off engine",Accelerate}', 'Pump the brake pedal, use engine braking by shifting to lower gears, use handbrake gradually, and steer to safety.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (70, 'Vehicle Maintenance', 'Which is the strongest gear on a vehicle?', '{"Reverse gear - has no alternative gear"}', '{"First gear","Third gear","Fifth gear"}', 'Reverse gear is the strongest because it has no alternative gear and provides maximum torque.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (71, 'Vehicle Maintenance', 'What are the four important parts to be maintained in a car?', '{Brakes,"Steering wheel",Wheels,Lights}', '{}', 'Critical maintenance parts are brakes, steering wheel, wheels (tires), and lights for safety.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (72, 'Vehicle Maintenance', 'What items must you carry in your vehicle?', '{"Fire extinguisher, triangle, first aid, spare wheel, jack"}', '{"Only spare wheel","Nothing required","Just fire extinguisher"}', 'Fire extinguisher, warning triangle, first aid kit, spare wheel, and jack.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (73, 'Traffic Signs', 'What does a green traffic light mean?', '{"Proceed if clear and safe"}', '{"Stop completely","Slow down","Speed up"}', 'A green light means you can proceed if the junction is clear and it is safe to do so.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (74, 'Traffic Signs', 'What rules apply to a yellow box junction?', '{"Do not enter unless clear. Exception: turn right if not obstructing"}', '{"Never enter","Always enter","Enter only at night"}', 'Do not enter unless your way ahead is clear. Exception: turning right, you can wait in box if not obstructing.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (75, 'Traffic Signs', 'What does a red traffic light mean?', '{"Stop completely"}', '{"Proceed with caution","Slow down","Speed up"}', 'A red light means you must stop completely before the stop line.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (76, 'Special Conditions', 'During night, if the oncoming vehicle does not dip the lights, what should you do?', '{"Slow down, flash 3 times, dip, possibly stop"}', '{"Flash back brightly","Speed up",Ignore}', 'Slow down, flash your lights three times, dip them, and if possible stop.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (77, 'Special Conditions', 'Describe any indicators that may warn you of an accident ahead', '{"Warning signs, emergency vehicles, stopped/slow vehicles"}', '{"Only sirens","Nothing visible","Only road signs"}', 'Accident warning signs (lifesaver), emergency vehicles with flashlights, or several vehicles stopped/moving slowly.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (78, 'Lighting and Signals', 'You must dip your headlights when following another vehicle within 200 meters. True or False?', '{True}', '{False}', 'True. Dip your headlights to avoid dazzling the driver ahead through their rear-view mirror.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (79, 'Lighting and Signals', 'When can you put on the lights during the day?', '{"During heavy rainfall","When it is misty","During an emergency"}', '{"When it is foggy"}', 'Headlights should be used during the day in foggy conditions, heavy rain, mist, or during emergencies for visibility.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (80, 'Lighting and Signals', 'When should you use your indicators?', '{"Before turning, changing lanes, overtaking"}', '{"When overtaking","Never needed","Only at night"}', 'Before turning, changing lanes, overtaking, pulling over, or moving off from a stationary position.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (81, 'Overtaking', 'Where should you NOT overtake?', '{"Bend, junction, hill, bridge, white line, restricted view"}', '{"Only at bends",Anywhere,"Only junctions"}', 'At bend, junction, brow of hill, humpback bridge, continuous white line, or where view of oncoming traffic is restricted.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (82, 'Overtaking', 'When can you overtake from the left?', '{"When vehicle ahead is turning right"}', '{"On one-way road with multiple lanes","When accident blocks right side",Anytime}', 'Overtaking from left is allowed when vehicle ahead is turning right, on one-way roads with multiple lanes, or when accident blocks right side.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (83, 'Overtaking', 'What is the minimum distance you should maintain after overtaking before returning to the left lane?', '{"See their headlights in mirror"}', '{"5 meters","10 meters",Immediately}', 'You should be able to see the overtaken vehicle''s headlights in your rear-view mirror before returning to the left lane.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (84, 'Vehicle Maintenance', 'Why must all vehicles be insured?', '{"For security purposes"}', '{"For decoration","For speed","For color"}', 'Vehicle insurance is mandatory for security purposes and to cover damages in case of accidents.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (85, 'Vehicle Maintenance', 'Under-inflated tyres increase fuel consumption. True or False?', '{True}', '{False}', 'True. Under-inflated tyres increase rolling resistance, leading to higher fuel consumption and faster tyre wear.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (86, 'Traffic Signs', 'What does the green arrow filter on the traffic lights mean?', '{"Go in the direction shown by arrow"}', '{Stop,"Turn around","Slow down"}', 'You should go in the direction shown by the green arrow.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (87, 'Speed Limits', 'What speed should you maintain when approaching a roundabout?', '{"20-30 km/hr"}', '{"50 km/hr","No need to slow down","80 km/hr"}', 'Reduce speed to 20-30 km/hr or slower depending on size of roundabout and traffic conditions.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (88, 'Speed Limits', 'What is the maximum speed limit on the highway for cars?', '{"110 km/hr"}', '{"80 km/hr","100 km/hr","120 km/hr"}', 'Cars can travel up to 110 km/hr on Kenyan highways.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (89, 'Speed Limits', 'A speed governor is mandatory for all commercial vehicles. True or False?', '{True}', '{False}', 'True. All public service vehicles (PSVs) and commercial vehicles must have speed governors installed and functional.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (90, 'Speed Limits', 'What is the penalty for exceeding speed limits in Kenya?', '{"Fines and license suspension"}', '{"Only a warning","Nothing happens","Just a fine"}', 'Penalties include fines, license suspension, and in severe cases, imprisonment depending on the degree of violation.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (91, 'Speed Limits', 'Speed limits can be exceeded in case of medical emergency. True or False?', '{False}', '{True}', 'False. Even in emergencies, you should drive safely. Emergency vehicles with sirens have special privileges, not private vehicles.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (92, 'Speed Limits', 'What is the minimum speed limit on highways?', '{"No minimum, but don''t drive too slowly"}', '{"40 km/hr","60 km/hr","80 km/hr"}', 'There is no minimum speed limit, but driving too slowly can be dangerous and cause traffic congestion.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (93, 'Speed Limits', 'What is the speed limit in a school zone during school hours?', '{"30 km/hr"}', '{"20 km/hr","50 km/hr","40 km/hr"}', 'The speed limit in school zones is typically 30 km/hr during school hours for safety of children.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (94, 'Speed Limits', 'What is the speed limit in residential areas?', '{"30-40 km/hr"}', '{"50 km/hr","80 km/hr","60 km/hr"}', 'The speed limit in residential areas is 30-40 km/hr to ensure safety of pedestrians.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (95, 'Right of Way', 'At a four-way stop, who has the right of way?', '{"First to arrive, or vehicle on right"}', '{"The largest vehicle","The fastest vehicle","No rules apply"}', 'The first vehicle to arrive at the stop has the right of way. If vehicles arrive simultaneously, the vehicle on the right has priority.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (96, 'Right of Way', 'Name four people in authority for whom you must stop', '{"Police officer","School warden",Flagman,"Person in charge of animals"}', '{}', 'You must stop for a Garda (police officer), school warden, flagman, and person in charge of animals.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (97, 'Right of Way', 'Pedestrians always have the right of way at marked crossings. True or False?', '{True}', '{False}', 'True. Drivers must yield to pedestrians at marked pedestrian crossings.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (98, 'Right of Way', 'What is a pedestrian?', '{"A road user on foot"}', '{"A cyclist","A motorcyclist","A driver"}', 'A pedestrian is any road user who is traveling on foot.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (99, 'Right of Way', 'At an uncontrolled intersection, who has the right of way?', '{"Vehicle on the right"}', '{"The faster vehicle","Vehicle on the left","The heavier vehicle"}', 'The vehicle on the right has the right of way. If in doubt, yield to traffic already in the intersection.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (100, 'Right of Way', 'When merging onto a highway, who has the right of way?', '{"Vehicles already on highway"}', '{"Merging vehicles","Both have equal right","Neither has priority"}', 'Vehicles already on the highway have the right of way. Merging vehicles must yield and adjust their speed.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (101, 'Right of Way', 'What should you do when you hear a siren from an emergency vehicle?', '{"Pull over and stop"}', '{"Speed up to get ahead","Continue at same speed","Honk back"}', 'Pull over to the side of the road safely and stop to allow the emergency vehicle to pass.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (102, 'Overtaking', 'What must you NOT do when being overtaken?', '{Accelerate}', '{"Slow down","Maintain speed","Move to the left"}', 'When being overtaken, you should not accelerate - maintain or reduce speed to allow safe overtaking.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (103, 'Parking', 'What is the maximum distance your vehicle should be from the kerb when parked?', '{"Within 45 centimeters"}', '{"1 meter","2 meters","No limit"}', 'Your vehicle should be within 45 centimeters (about 1.5 feet) from the kerb.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (104, 'Parking', 'How close to a junction can you park?', '{"5 meters"}', '{"1 meter","3 meters","10 meters"}', 'You must park at least 5 meters away from a junction to ensure visibility and safety.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (105, 'Parking', 'What is a Clearway?', '{"Stopping and parking prohibited (except buses/taxis)"}', '{"Free parking area",Highway,"Pedestrian zone"}', 'Stopping and parking are prohibited (except buses/taxis) for period shown on sign.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (106, 'Parking', 'What lights should you leave on when parked at night?', '{"Parking lights"}', '{"No lights needed","Full headlights","Hazard lights"}', 'Parking lights (side lights) should be left on when parked on a road at night.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (107, 'Parking', 'How far should you park from a fire hydrant?', '{"At least 3 meters"}', '{"1 meter","5 meters","No restriction"}', 'At least 3 meters away from a fire hydrant to allow emergency access.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (108, 'Parking', 'Yellow kerb markings mean no parking at any time. True or False?', '{True}', '{False}', 'True. Yellow kerb markings indicate no parking, no waiting, and in some areas no stopping.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (109, 'Lighting and Signals', 'Name the restrictions in relation to the use of the horn', '{"Not between 11:30 PM - 7:00 AM in built-up areas except emergency"}', '{"No restrictions","Never use","Only in emergency"}', 'Must not be used between 11:30 PM and 7:00 AM in built-up areas except in emergency.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (110, 'Parking', 'Name four places you can NOT stop?', '{"On a roundabout","At the junction","At the center of the road","Where there is no stopping sign"}', '{}', 'Stopping is prohibited on roundabouts, at junctions, at the center of the road, and where there are no stopping signs.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (111, 'Parking', 'Where should you NOT park?', '{"Bend, hill, bus stop, entrance"}', '{"Anywhere is fine","Only at bus stops","Only on hills"}', 'Near a bend, brow of a hill, bus stop, entrance/exit, where you would block signs or obstruct other vehicles.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (112, 'Junctions and Roundabouts', 'What is a box junction?', '{"Yellow criss-cross, don''t enter unless exit clear"}', '{"Parking area","Speed zone","Bus stop"}', 'A box junction has yellow criss-cross lines. You must not enter unless your exit is clear, except when turning right.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (113, 'Junctions and Roundabouts', 'What is a staggered junction?', '{"Side roads at different points, need extra caution"}', '{"Normal junction",Roundabout,T-junction}', 'A staggered junction has side roads on opposite sides of the main road at slightly different points, requiring extra caution.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (114, 'Junctions and Roundabouts', 'Which lane should you use at a roundabout to turn right?', '{"Right lane"}', '{"Left lane","Any lane","Middle lane"}', 'Use the right lane when approaching and on the roundabout until you need to change to the left lane to exit.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (115, 'Junctions and Roundabouts', 'Why should you look right twice when approaching a junction?', '{"Right side is near danger"}', '{"Left side is dangerous","Traffic lights","Road signs"}', 'Right side is the near danger side, so checking twice ensures safety before proceeding.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (116, 'Junctions and Roundabouts', 'At a T-junction, traffic on the main road has priority. True or False?', '{True}', '{False}', 'True. Traffic on the continuing road has priority over traffic joining from the side road.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (117, 'Junctions and Roundabouts', 'Name four common mistakes made when approaching a roundabout', '{"Wrong lane approach","Changing lanes on roundabout","Wrong lane exit","Observing wrong side"}', '{}', 'Common mistakes include wrong lane approach, changing lanes on roundabout, wrong lane exit, and observing wrong side.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (118, 'Junctions and Roundabouts', 'At a STOP sign which has no white line, where would you stop?', '{"At the STOP sign"}', '{"Before the sign","After the sign",Anywhere}', 'At the STOP sign itself when there is no white line marked.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (119, 'Junctions and Roundabouts', 'How can a driver control himself in an uncontrolled roundabout?', '{"Check no vehicle from right side"}', '{"Drive fast through it","Always stop completely","Sound horn"}', 'Make sure there is no oncoming vehicle from the right side on the roundabout before entering.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (120, 'Junctions and Roundabouts', 'You should signal left when exiting a roundabout. True or False?', '{True}', '{False}', 'True. Signal left just after passing the exit before the one you intend to take.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (121, 'Lighting and Signals', 'When should you use hazard lights?', '{"Breakdown or emergency"}', '{"When overtaking","When speeding","At night"}', 'Use hazard lights when your vehicle is broken down, in an emergency, or to warn other drivers of a hazard ahead.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (122, 'Road Markings', 'What do white zig-zag lines on the road mean?', '{"Pedestrian crossing area, no overtaking or parking"}', '{"Parking allowed","Speed limit zone","Bus lane"}', 'White zig-zag lines indicate a pedestrian crossing area. No overtaking or parking allowed.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (123, 'Road Markings', 'What do white diagonal lines in the center of the road mean?', '{"Traffic island - do not enter (ghost island)"}', '{"Parking area","Overtaking zone","Bus lane"}', 'Treat them like a traffic island - you do not enter this ghost island area.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (124, 'Road Markings', 'What does a broken white line in the center of the road mean?', '{"May overtake if safe"}', '{"No overtaking","Bus lane","Bicycle lane"}', 'A broken white line means you may overtake if it is safe to do so.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (125, 'Road Markings', 'What does a double continuous line mean?', '{"Cannot cross to overtake, keep to your side"}', '{"Can overtake anytime","Parking zone","Speed limit changes"}', 'A double continuous line means you cannot cross to overtake - keep to your side.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (126, 'Road Markings', 'What is the meaning of a yellow-painted kerb?', '{"No parking, no waiting, sometimes no stopping"}', '{"Parking allowed","Loading zone","Bus stop"}', 'A yellow-painted kerb means no parking, no waiting, and in some places no stopping.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (127, 'Pedestrians and Crossings', 'What is a school warden?', '{"Person authorized to stop traffic for school children"}', '{"Traffic police","School teacher","Security guard"}', 'A school warden is a person authorized to stop traffic to allow school children to cross the road safely.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (128, 'Pedestrians and Crossings', 'What extra care should you take near parked ice cream vans?', '{"Children may run out, slow down and be vigilant"}', '{"Speed up","No special care needed","Honk continuously"}', 'Children may run out from behind the van without looking. Slow down and be extra vigilant.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (129, 'Pedestrians and Crossings', 'Describe your approach at a pedestrian crossing', '{"Be alert, speed to control and stop if needed"}', '{"Speed up","Sound horn","Flash lights"}', 'Be alert and at a speed at which you can control and stop in case of emergency.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (130, 'Pedestrians and Crossings', 'How would you know a Zebra crossing at night?', '{"Yellow flashing beacons"}', '{"Street lights","Road signs only","Traffic lights"}', 'By the yellow flashing beacons indicating the crossing location.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (131, 'Pedestrians and Crossings', 'What is a zebra crossing?', '{"Pedestrian crossing marked with black and white stripes"}', '{"Vehicle crossing","Animal crossing","Bus stop"}', 'A zebra crossing is a pedestrian crossing marked with black and white stripes where pedestrians have right of way.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (132, 'Pedestrians and Crossings', 'You must stop if a pedestrian is waiting at a zebra crossing. True or False?', '{True}', '{False}', 'True. You must stop and give way to pedestrians waiting to cross at a zebra crossing.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (133, 'Pedestrians and Crossings', 'What does the island in the center of a pedestrian crossing mean?', '{"Each side is a separate crossing"}', '{"No crossing allowed","Rest area","Emergency stop"}', 'Each side of the island is a separate crossing that must be treated individually.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (134, 'Pedestrians and Crossings', 'What is the name given to anybody carrying a sign of STOP CHILDREN CROSSING?', '{"School warden"}', '{"Police officer","Traffic controller","Security guard"}', 'A school warden is authorized to stop traffic for children crossing.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (135, 'Pedestrians and Crossings', 'Pedestrians walking on a road should walk facing oncoming traffic. True or False?', '{True}', '{False}', 'True. Pedestrians should walk on the right side of the road facing oncoming traffic to see vehicles approaching.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (136, 'Junctions and Roundabouts', 'When turning right at a junction, where should you position your vehicle?', '{"Right side of lane, check mirrors, signal"}', '{"Far left",Center,Anywhere}', 'Position your vehicle to the right side of your lane, check mirrors, signal right, and wait for a safe gap in traffic.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (137, 'Junctions and Roundabouts', 'What position would you take up for a right turn at the end of a one-way street?', '{"Extreme right lane"}', '{"Extreme left lane",Center,"Any position"}', 'When turning right at a junction, drive at the extreme right position.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (138, 'Accidents and Emergencies', 'What should you do after your vehicle has broken down?', '{"Push vehicle off road, hazard lights on, warning triangle 50m away"}', '{"Leave vehicle in middle of road","Wait for help in vehicle","Drive slowly to nearest garage"}', 'After breakdown, push vehicle off road if possible, put on hazard lights, and place warning triangle 50 meters away.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (139, 'Parking', 'You can park on the right side of the road facing oncoming traffic. True or False?', '{False}', '{True}', 'False. You must always park on the left side of the road in the direction of traffic flow.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (140, 'Road Markings', 'When can you cross a continuous white line?', '{"To avoid obstruction, for access, or broken line on your side"}', '{Never,Anytime,"Only at night"}', 'To avoid an obstruction, for access, or if there is a broken white line on your side.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (141, 'Overtaking', 'What must you NOT do when being overtaken?', '{Accelerate}', '{"Slow down","Maintain speed","Move to the left"}', 'When being overtaken, you should not accelerate - maintain or reduce speed to allow safe overtaking.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (142, 'Road Markings', 'What does a single continuous yellow line mean?', '{"No parking at certain times"}', '{"No parking ever","Loading zone","Taxi rank"}', 'A single continuous yellow line means no parking at certain times (generally during working hours).');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (143, 'Speed Limits', 'What is the maximum speed limit for trailers on the highway?', '{"65 km/hr"}', '{"80 km/hr","50 km/hr","100 km/hr"}', 'Trailers are limited to 65 km/hr on highways for safety.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (144, 'Road Markings', 'What does a broken yellow line mean?', '{"Edge of roadway (hard shoulder)"}', '{"Center of road","Bus stop","Bicycle lane"}', 'A broken yellow line indicates the edge of the roadway (hard shoulder).');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (145, 'Road Markings', 'If there are two parallel lines in the center of the road, one continuous and one broken, which do you obey?', '{"The line nearest to you"}', '{"The continuous line","The broken line",Neither}', 'You obey the line nearest to you on your side of the road.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (146, 'Speed Limits', 'What is the maximum speed limit for pick-ups and lorries on the highway?', '{"80 km/hr"}', '{"110 km/hr","50 km/hr","100 km/hr"}', 'Pick-ups and lorries are limited to 80 km/hr on highways.');
INSERT INTO public.theory OVERRIDING SYSTEM VALUE VALUES (147, 'Lighting and Signals', 'What should you do if dazzled by oncoming headlights?', '{"Slow down, look left, stop if necessary"}', '{"Speed up","Flash back","Close eyes"}', 'Slow down, look to the left edge of the road, and if necessary, stop until you can see clearly again.');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('90ef229c-a2cc-4fdc-b92c-b733b0c27bfb', NULL, 'ismailanyibsn@gmail.com', '$2b$10$aaypWRbPS7VHw98dkmQwlO5pdww7xdLFgzydXbD3KCh7wBnwC3FB2', 'Ismail', 'Mailanyi', NULL, NULL, 'student', '2026-06-15 21:46:14.1024', '21787f1c3b5576822e7b13d06dbb65032002a42b', '2026-06-15 22:48:12.846+03', 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 21:46:14.1024', NULL, NULL, NULL, NULL, 23);
INSERT INTO public.users VALUES ('7844f1ab-d790-47be-8851-487155004b26', NULL, 'student1@gmail.com', '$2b$10$kPRGBp0kL4XauVVejUKZauoNkMXcXnCYgAXXDXdQIPAlkbBMGlYNe', 'Student', '1', NULL, NULL, 'student', '2026-06-15 21:54:02.456061', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 21:54:02.456061', NULL, NULL, NULL, NULL, 23);
INSERT INTO public.users VALUES ('3b8ca6d2-6221-4863-87d7-766ede7a5cb9', '', 'student@gmail.com', '$2b$10$2ImBB2/AFUFgO2pndA4Jb.PjpEeoYnu/7GZIzCHPmg7hGr6xelXSe', 'Student', 'Mailan', NULL, NULL, 'student', '2026-06-15 12:05:11.065388', NULL, NULL, 1, 1, NULL, 75, true, NULL, 1, '2026-06-16', 5, '2026-06-15 22:16:48.105', NULL, '/uploads/1781528983576-745432960.jpg', '2026-06-15 15:10:41.95', 'isma', NULL);
INSERT INTO public.users VALUES ('be0f4305-c99c-4f1e-88a8-578c55b90e67', NULL, 'student3@gmail.com', '$2b$10$ggoJ738ncaBAWbiyi1noG.ig9osONePb/VZBjkGumblKQskl.LOWO', 'Student', '3', NULL, NULL, 'student', '2026-06-23 13:13:10.985531', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-23 13:13:10.985531', NULL, NULL, NULL, 'studentf851', 20);
INSERT INTO public.users VALUES ('d286306d-7f07-4ace-86a7-44c1ef0cb707', NULL, 'chanillemuthoni@gmail.com', '$2b$10$JqEpm.1NSYbvN52FFnlwHunOaDbT2NhuPMqIVyX1HA2JYlLB1j/S.', 'Chanille', 'Muthoni', NULL, NULL, 'student', '2026-06-29 14:24:19.539599', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-29 14:24:19.539599', NULL, NULL, NULL, 'chanille42b5', 23);
INSERT INTO public.users VALUES ('b002eae8-7f22-46eb-b5fb-2f077ea09ddd', '07232432423', 'deluni60@gmail.com', '$2b$10$3GgUNHUVCFwXCy2FvFTa9ujk1wx9R6xecvaIJmV3H/DWROyWeBkhq', 'Isma', 'maila', NULL, NULL, 'student', '2026-04-29 15:24:58.563641', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('b4a419f5-eeb4-4d24-9bba-00bcddf98397', '0712345679', '', '$2b$10$Dcs3SIfr9zpMt9oJVzDzRuZ.jkHSaxlPAPzVmtuiHHel/711VhMyu', 'Ismaol', '122', NULL, NULL, 'student', '2026-06-15 21:56:43.564221', NULL, NULL, 1, 1, '133702', 240, false, NULL, 1, '2026-06-15', 1, '2026-06-15 22:59:44.646', '{"lessonId": 3, "chapterId": 0, "sectionId": 0, "exerciseId": 1}', '/uploads/1781553073398-321623467.jpeg', '2026-06-15 22:53:02.641', '', 23);
INSERT INTO public.users VALUES ('0e5c3ba0-b246-47fa-a77e-1c9211eb69a2', '0758202702', 'me.ismailanyi@gmail.com', '$2b$10$BbaRsdDN1R6jsCF5bLfXDOfs1qLiZ0QCziqbaEXwZjHRsEGLUNfkS', 'Ismail', 'Mailanyi', 'email', NULL, 'system-administrator', '2026-02-09 16:47:03.260068', '2d955e63ede385cb578af235b105952c9b37e076', '2026-04-27 23:31:57.519+03', 1, 1, NULL, 1360, false, NULL, 0, '2026-07-07', 5, '2026-06-15 12:50:55.550707', '{"lessonId": 1, "chapterId": 0, "sectionId": 0, "exerciseId": 1}', '/uploads/1781523546047-412285046.jpg', '2026-06-29 14:27:58.289', 'ismailanyi', NULL);
INSERT INTO public.users VALUES ('ea6a1374-e277-43d5-9c0f-d6ca3ce69a52', '07234123123', 'ismailanyi@gmail.com', '$2b$10$koUAXfZ2WU6EZnwe7BH9FOhxYjxtHbFp90DlH6.tk5gjSRw2vJW.2', 'Ismail', 'Mailanyi', NULL, NULL, 'driving-instructor', '2026-06-15 10:08:53.417394', NULL, NULL, 1, 1, '133702', 0, true, NULL, 1, '2026-07-07', 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('d88a3730-501d-450f-bbc0-e4828ba25497', NULL, 'student@cuea.edu', '$2b$10$7MQ6ULi6qZ1L11YMXppQu.X.3zWOr5whR1Z29bykeb1EV2z7K4CGu', 'Student', 'Cuea', NULL, NULL, 'student', '2026-06-30 12:46:54.870006', NULL, NULL, 1, 1, '133702', 90, false, NULL, 1, '2026-06-30', 3, '2026-07-02 13:40:09.314', '{"lessonId": 1, "chapterId": 0, "sectionId": 0, "exerciseId": 1}', NULL, '2026-07-02 13:48:58.847', 'student0cd2', 23);
INSERT INTO public.users VALUES ('df60fcb9-053e-48eb-abc1-263ceb504e08', '0724094850', NULL, '$2b$10$PThgYL1fTY.9yG31W2lBy.VbRhFXDPHbslw83WK0IfRk28DEwCu3.', 'Mohammed ', 'Ahmed', NULL, NULL, 'student', '2026-07-02 13:50:54.0039', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, '2026-07-02', 5, '2026-07-02 13:50:54.0039', NULL, NULL, NULL, 'mohammed2a3d', 21);
INSERT INTO public.users VALUES ('fb4e4e09-d4a8-4ccf-ab7e-5c8ff8a9960c', '0757090729', 'tibeka@gmail.com', '$2b$10$xMa1RlOT/xVRpWoSBdPwN.IbwRyLwyRkhtMQ1JaQiuEwBF/nUv0zW', 'aisha', 'kabeti', NULL, NULL, 'student', '2026-04-29 15:27:17.593401', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('e6521042-7f88-4004-b551-5fbd8326376e', '076766098', 'laksjdfasdf', '$2b$10$qpC/u44QtxeXv/lj6Kwby.J2JZ1UXJN3IzCE2LABJfE/.uxabP7gm', 'ismak', 'asdf', NULL, NULL, 'student', '2026-04-29 15:44:23.380921', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('c6951dd1-0540-4f61-9965-6e3eeb89f112', '0711414501', 'mrembo@gmail.com', NULL, 'aziza', 'mrembo', NULL, NULL, 'student', '2026-04-29 16:00:14.360182', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('8361c14a-7dfe-4d02-aacf-8bd0d6aa5e4b', '07111111123123', 'mark123@gmail.com', NULL, 'MARK', 'ndirangu', NULL, NULL, 'student', '2026-04-29 16:10:23.162124', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('c0bb5421-9537-42ee-b69b-b77e743e0aa6', '0712312312123', 'lec123@gmail.com', NULL, 'lec', 'leasd', NULL, NULL, 'student', '2026-04-29 16:23:11.728661', NULL, NULL, 1, 1, NULL, 0, false, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('e6f87be3-a82b-4757-be3d-abf48e8a2b34', '07123123122', 'instructor@gmail.com', '$2b$10$hGaOLFaTo58/xjxh58kThuHki7nRXQ7b0wVfN9HidU7/E0JSDy8t2', 'driving', 'instructor', NULL, NULL, 'student', '2026-06-14 20:34:35.421787', NULL, NULL, 1, 1, NULL, 0, true, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('9c5cda34-0d00-4ead-983c-abd2eb92f295', '07123123123', 'aak@gmail.com', '$2b$10$PqqDG2NRVL24shvt.r.YreSzSoHodPF5T9bVfW4tmGNqR4rSgmUyS', 'aak', 'driving', NULL, NULL, 'student', '2026-06-14 20:49:58.849345', NULL, NULL, 1, 1, NULL, 0, true, NULL, 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('d5123cbc-8fcf-4e7e-9820-63979d2410a7', '0712345678', 'test@student.cuea.edu', '$2b$10$xnhCyoyw1rJNHQ13f86EAeoGmO3KRqvXQ1xz9acmJZ8HnjKIG.Bee', 'Aisha', 'Abdullah', 'email', NULL, 'driving-instructor', '2026-02-11 15:11:10.649748', NULL, NULL, 1, 1, NULL, 0, false, '', 0, NULL, 5, '2026-06-15 12:50:55.550707', NULL, NULL, NULL, NULL, NULL);


--
-- Name: intake_periods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.intake_periods_id_seq', 1, false);


--
-- Name: question_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.question_attempts_id_seq', 90, true);


--
-- Name: question_suggestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.question_suggestions_id_seq', 1, true);


--
-- Name: quiz_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quiz_results_id_seq', 88, true);


--
-- Name: road_signs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.road_signs_id_seq', 1543, true);


--
-- Name: system_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_feedback_id_seq', 4, true);


--
-- Name: theory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.theory_id_seq', 147, true);


--
-- Name: intake_periods intake_periods_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intake_periods
    ADD CONSTRAINT intake_periods_name_key UNIQUE (name);


--
-- Name: intake_periods intake_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intake_periods
    ADD CONSTRAINT intake_periods_pkey PRIMARY KEY (id);


--
-- Name: question_attempts question_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_attempts
    ADD CONSTRAINT question_attempts_pkey PRIMARY KEY (id);


--
-- Name: question_suggestions question_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_suggestions
    ADD CONSTRAINT question_suggestions_pkey PRIMARY KEY (id);


--
-- Name: quiz_results quiz_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_pkey PRIMARY KEY (id);


--
-- Name: road_signs road_signs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.road_signs
    ADD CONSTRAINT road_signs_pkey PRIMARY KEY (id);


--
-- Name: system_feedback system_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_feedback
    ADD CONSTRAINT system_feedback_pkey PRIMARY KEY (id);


--
-- Name: theory theory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theory
    ADD CONSTRAINT theory_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_provider_id_key UNIQUE (provider_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_quiz_results_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quiz_results_user ON public.quiz_results USING btree (user_id);


--
-- Name: question_attempts question_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_attempts
    ADD CONSTRAINT question_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: question_suggestions question_suggestions_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_suggestions
    ADD CONSTRAINT question_suggestions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: question_suggestions question_suggestions_suggested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_suggestions
    ADD CONSTRAINT question_suggestions_suggested_by_fkey FOREIGN KEY (suggested_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: quiz_results quiz_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: system_feedback system_feedback_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_feedback
    ADD CONSTRAINT system_feedback_instructor_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ssSn8MtoVtUpfUUHtHs6Pxcb3PSzQqGVZWMGqAotgkHc3r4ew4pWmsX6Xr8fUmo

