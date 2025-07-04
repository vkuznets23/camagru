--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Comment" OWNER TO viktoria;

--
-- Name: EmailVerificationToken; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."EmailVerificationToken" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmailVerificationToken" OWNER TO viktoria;

--
-- Name: Follower; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."Follower" (
    id text NOT NULL,
    "followerId" text NOT NULL,
    "followingId" text NOT NULL
);


ALTER TABLE public."Follower" OWNER TO viktoria;

--
-- Name: Like; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."Like" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "postId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO viktoria;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    content text,
    image text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Post" OWNER TO viktoria;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO viktoria;

--
-- Name: User; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text NOT NULL,
    username text NOT NULL,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone,
    bio text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO viktoria;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO viktoria;

--
-- Name: _SavedPosts; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public."_SavedPosts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_SavedPosts" OWNER TO viktoria;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: viktoria
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO viktoria;

--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."Comment" (id, content, "createdAt", "postId", "userId") FROM stdin;
cmcdgq0x500071n23x6nzsvu3	cool ass!	2025-06-26 14:12:26.537	cmcdaywj800141nqniqiys7kc	cmc1sqwpn00001nd9wiho0h5l
\.


--
-- Data for Name: EmailVerificationToken; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."EmailVerificationToken" (id, token, "userId", expires) FROM stdin;
\.


--
-- Data for Name: Follower; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."Follower" (id, "followerId", "followingId") FROM stdin;
cmcda8qle00101nqnr0pg6xtu	cmcd6zmjx00021nqnmcn3u1m8	cmc1sqwpn00001nd9wiho0h5l
cmcehvy65000e1n23mojlzr01	cmcehuzao000a1n23vzys3883	cmc1sqwpn00001nd9wiho0h5l
cmcek3x9n00011nvypezuy2hl	cmc1sqwpn00001nd9wiho0h5l	cmcd6zmjx00021nqnmcn3u1m8
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."Like" (id, "userId", "postId", "createdAt") FROM stdin;
cmcdgpvam00051n238rzwkd5m	cmc1sqwpn00001nd9wiho0h5l	cmcdaywj800141nqniqiys7kc	2025-06-26 14:12:19.247
cmckcx6rp00091n0k1yw6h9um	cmc1sqwpn00001nd9wiho0h5l	cmckcps0600051n0k8tqclvpo	2025-07-01 10:00:25.478
cmckcxgve000b1n0k04x1stg9	cmc1sqwpn00001nd9wiho0h5l	cmckcp8o400011n0kehj9wp1p	2025-07-01 10:00:38.571
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."Post" (id, content, image, "userId", "createdAt") FROM stdin;
cmckcx2rr00071n0kt0wv8zj1	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751364016/i6re8tnqx0cmw9lte0ga.jpg	cmc1sqwpn00001nd9wiho0h5l	2025-07-01 10:00:20.294
cmckcpid400031n0krmji07io	playing!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751363663/igui39ocrdyi3qdyfij0.jpg	cmc1sqwpn00001nd9wiho0h5l	2025-07-01 09:54:27.256
cmckcp8o400011n0kehj9wp1p	hehe	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751363652/gxpwamixm9spovshs7vr.jpg	cmc1sqwpn00001nd9wiho0h5l	2025-07-01 09:54:14.688
cmcdaywj800141nqniqiys7kc	hey its me!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1750937476/zs01caebgxcaoq7akbh4.jpg	cmcd6zmjx00021nqnmcn3u1m8	2025-06-26 11:31:23.06
cmciss0gj00011nct8c8ctd4p	yaaay!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269722/tn5wfhdxkg3epcvvwn3g.jpg	cmcd6zmjx00021nqnmcn3u1m8	2025-06-30 07:48:45.519
cmcissalz00031nctmybyedp4	my wife!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269736/itiqnbwuywpptugebkna.jpg	cmcd6zmjx00021nqnmcn3u1m8	2025-06-30 07:48:58.679
cmcissmb100051nct3bi87trh	friends!!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269751/jogdaul0fo3v585sczzl.jpg	cmcd6zmjx00021nqnmcn3u1m8	2025-06-30 07:49:13.838
cmcist6nf00071ncto18s6pvv	darts!!!	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269778/qwnv5khfwte4j1bsm66s.jpg	cmcehuzao000a1n23vzys3883	2025-06-30 07:49:40.203
cmcistiwg00091ncteoptd35e	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269791/lloy2qcv3dfzy5ipv3vg.jpg	cmcehuzao000a1n23vzys3883	2025-06-30 07:49:56.08
cmcisuds2000b1nctled5l4qv	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269834/t44kzqvmnxa8lkdhceie.jpg	cmcehuzao000a1n23vzys3883	2025-06-30 07:50:36.099
cmcisujua000d1nct8l95vug6	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269842/r7nfqfpeaxvp0oxhzxuc.jpg	cmcehuzao000a1n23vzys3883	2025-06-30 07:50:43.954
cmcisutd5000f1nctihnnlait	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751269853/kbghy0vnk7ba4pnjo6el.jpg	cmcehuzao000a1n23vzys3883	2025-06-30 07:50:56.297
cmciwkifi00031n10r2ovlvji	gkdjfglkdsfjgl	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751276090/ktvhcv0g9mqaeonop6vg.jpg	cmcd6zmjx00021nqnmcn3u1m8	2025-06-30 09:34:54.031
cmckcps0600051n0k8tqclvpo	\N	https://res.cloudinary.com/dbdoitv1m/image/upload/v1751363678/hcxy6yggpvzejjtjfm1z.jpg	cmc1sqwpn00001nd9wiho0h5l	2025-07-01 09:54:39.75
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."User" (id, email, "emailVerified", image, password, username, "resetToken", "resetTokenExpiry", bio, name, "createdAt", "updatedAt") FROM stdin;
cmcd6zmjx00021nqnmcn3u1m8	victoria.cuzneczo23@gmail.com	2025-06-26 09:40:11.665	https://res.cloudinary.com/dbdoitv1m/image/upload/v1750937504/kqihsedfsjz6lpzewdhq.jpg	$2b$12$B44QpxsbN6MbNRYU69K.ruk2RNLaUbz.kCTXqmsASreDJKci1AGTu	kotik	\N	\N	its nice to be 2nd user here	pupsik	2025-06-26 09:39:58.317	2025-06-26 11:32:05.36
cmcehuzao000a1n23vzys3883	victoria.ceczowa23@gmail.com	2025-06-27 07:32:20.438	\N	$2b$12$K/OPWSDxlh88gIG7L3Npi.V0qz1yyl5gga2TYgOjQdfgMV7SL6z4y	kotik2	\N	\N	\N	\N	2025-06-27 07:32:03.503	2025-06-27 07:32:20.439
cmc1sqwpn00001nd9wiho0h5l	victoria.cuzneczowa23@gmail.com	2025-06-18 10:16:01.569	https://res.cloudinary.com/dbdoitv1m/image/upload/v1750241815/vlsg0usynaa0ef66a62l.jpg	$2b$12$Tcj1dUOlOfN1S3Vlmrrt3O.F9K4wOkABnfdeHj1.1HzArmZHNg4c.	vika	8b0f8779-7960-49b8-98be-6cb81ef2535b	2025-07-02 14:02:26.43	Hello! It's my neeeeew page!\nenjoy ;)	Viktoriia 	2025-06-18 10:15:49.019	2025-07-02 13:32:26.431
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _SavedPosts; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public."_SavedPosts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: viktoria
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
41c83b1c-8f12-48e1-b337-99ff0f20cefd	7ccf227196e408497d82520938e34b460be090aa6fb67f1c1a67fdfba20b929e	2025-06-18 13:12:51.82644+03	20250605094706_init	\N	\N	2025-06-18 13:12:51.802791+03	1
2beb2fb4-624d-4805-914f-0725714d31f2	f8feb4c4a26f70caac0ca9eb31a5f6eb6fd4a76039741488ed29ee162cc3d674	2025-06-26 09:55:45.502431+03	20250626065544_add_comment_replies	\N	\N	2025-06-26 09:55:45.497505+03	1
328d9ecd-db97-4265-b03a-4115313cbc83	cb03ce28a6ed4907a49f22e84d42bf2af4458cbc0ffe56c8fb16a45168d7b7d5	2025-06-18 13:12:51.830109+03	20250605101910_add_username_to_user	\N	\N	2025-06-18 13:12:51.827157+03	1
76499543-844e-4880-a91b-dbcca1169c16	6a1ab79a0354e1beace17f4c160954e6a715bed9aee244cf2bfbc561c85ac92e	2025-06-18 13:12:51.836922+03	20250605102348_add_email_verification_token	\N	\N	2025-06-18 13:12:51.831293+03	1
9a927e7d-c4ad-4799-bd66-93e1908cb48d	d41c5c63d1d905bf2ac2374b1ad2624b92da72176d304db5ce3731601e7b84b7	2025-06-18 13:12:51.839113+03	20250609092341_add_reset_token	\N	\N	2025-06-18 13:12:51.837503+03	1
d048625a-62df-4d53-88cb-207e59ace0ed	24ad9e899f07064a2fcd800b2a0d36f92a3b0e8ba4964f624ba42f27bc74ef42	2025-06-26 10:47:55.175292+03	20250626074754_add_comment_replies	\N	\N	2025-06-26 10:47:55.171629+03	1
50239441-711d-411f-be91-86100222b4c1	94dd08b6be49e259ceeba33db03384eefd1dbdce8ef07cc4646b4b307d14bc25	2025-06-18 13:12:51.842409+03	20250611082516_add_user_profile_fields	\N	\N	2025-06-18 13:12:51.839602+03	1
5682d6b5-a82f-432c-91a8-eb8144b21bf6	37fdee7e0fa1c3bca8c386bbb92c53a425f92d79d8299bc50e46096202cf4d93	2025-06-18 13:12:51.846021+03	20250611083641_add_user_profile	\N	\N	2025-06-18 13:12:51.842988+03	1
edf86174-fc4a-4629-92e0-0af765928fdb	72201520bd8734405fe157c8b98263cfc6c8eedc4fce91990163b7be16e50a81	2025-06-18 13:12:51.857767+03	20250617080209_add_followers_posts	\N	\N	2025-06-18 13:12:51.848305+03	1
755a3c23-174c-4c90-ad18-ba004a72e66f	838fd49485fbca0fcc14484f987d204b0a3de304c270e9772f9af9521e6c45f6	2025-06-26 10:57:00.073987+03	20250626075659_add_saved_posts	\N	\N	2025-06-26 10:57:00.061616+03	1
837bd724-95a2-4e13-b5b6-5badc4c4ac19	fe8d7e16c9f2fd3ea5971fa0aaea93ff0901e7242c7760fb16f98d6f7e61745c	2025-06-18 13:12:51.859988+03	20250618095647_add_followers_posts	\N	\N	2025-06-18 13:12:51.85831+03	1
be17c678-7524-4fc0-a2ea-a0d5b27c9810	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-06-23 13:16:36.906981+03	20250618101307_add_followers_posts	\N	\N	2025-06-23 13:16:36.900793+03	1
d53cd546-63c7-48ab-826f-848f84c27137	08afc5cbbdd22084d2014a96b30d10fadf4ecc6dde0f33df4fa078e8813f8ed8	2025-06-23 13:16:37.771968+03	20250623101637_add_comments_model	\N	\N	2025-06-23 13:16:37.759939+03	1
700f3fde-91a9-4a7a-9a0c-05fe94604e9b	9351ab62c7c12220cfddcf7c8975f7d27184a373aff5f42c381655aa13f42140	2025-07-01 12:40:59.527821+03	20250701094059_add_ondelete_cascade_to_like	\N	\N	2025-07-01 12:40:59.513921+03	1
3fd20e4f-86f3-4ef2-abc0-70b4f2477ce1	6598a84f36a7bc36a801d1711c81c6ed9b2a1ec9fe1f234c28b073a39ef88b1e	2025-06-25 09:59:46.664397+03	20250625065946_add_cascade_to_comments	\N	\N	2025-06-25 09:59:46.6577+03	1
5a27997a-7268-4101-99d5-8e6dbd402e1d	659709d122cd81b6d59f52a10fad8b7df322c22f2db3f975fcdcf254f7bd06e2	2025-06-25 10:09:51.066786+03	20250625070950_add_post_likes	\N	\N	2025-06-25 10:09:51.057243+03	1
31d5f444-823c-4b9d-9432-b22072eda406	46b1b76af81df0d47273e2ff405fdc8fb15bd46cb85650ea2a9498a6815ed3ba	2025-06-25 11:27:20.484763+03	20250625082720_add_like_table	\N	\N	2025-06-25 11:27:20.465605+03	1
\.


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: EmailVerificationToken EmailVerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."EmailVerificationToken"
    ADD CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY (id);


--
-- Name: Follower Follower_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "Follower_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _SavedPosts _SavedPosts_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."_SavedPosts"
    ADD CONSTRAINT "_SavedPosts_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: EmailVerificationToken_token_idx; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE INDEX "EmailVerificationToken_token_idx" ON public."EmailVerificationToken" USING btree (token);


--
-- Name: EmailVerificationToken_token_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON public."EmailVerificationToken" USING btree (token);


--
-- Name: Follower_followerId_followingId_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "Follower_followerId_followingId_key" ON public."Follower" USING btree ("followerId", "followingId");


--
-- Name: Like_userId_postId_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "Like_userId_postId_key" ON public."Like" USING btree ("userId", "postId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: _SavedPosts_B_index; Type: INDEX; Schema: public; Owner: viktoria
--

CREATE INDEX "_SavedPosts_B_index" ON public."_SavedPosts" USING btree ("B");


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmailVerificationToken EmailVerificationToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."EmailVerificationToken"
    ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follower Follower_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Follower Follower_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _SavedPosts _SavedPosts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."_SavedPosts"
    ADD CONSTRAINT "_SavedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SavedPosts _SavedPosts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: viktoria
--

ALTER TABLE ONLY public."_SavedPosts"
    ADD CONSTRAINT "_SavedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

