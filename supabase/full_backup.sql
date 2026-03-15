--
-- PostgreSQL database dump
--

\restrict jkmuXRt61JKkvz2vzPrCsimaqA5VcaPGO8sacjAxewMRuxqNn7YuPgwZ6MXmnXp

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: execution_force; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.execution_force AS ENUM (
    'thesis_integrity',
    'learning_velocity',
    'decision_quality_under_load',
    'talent_gravity',
    'delivery_control',
    'resilience_economics'
);


ALTER TYPE public.execution_force OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'founder',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: venture_outcome; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.venture_outcome AS ENUM (
    'active',
    'success_exit',
    'failure',
    'zombie',
    'pivot'
);


ALTER TYPE public.venture_outcome OWNER TO postgres;

--
-- Name: venture_stage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.venture_stage AS ENUM (
    'idea',
    'pre_seed',
    'seed',
    'series_a',
    'series_b',
    'series_c_plus',
    'acquired',
    'ipo',
    'shutdown'
);


ALTER TYPE public.venture_stage OWNER TO postgres;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.founders (auth_user_id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'founder'::public.user_role)
  )
  on conflict (auth_user_id) do update
    set email = excluded.email,
        name  = excluded.name,
        role  = excluded.role,
        updated_at = now();

  return new;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: assessment_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_responses (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    assessment_id uuid NOT NULL,
    question_id text NOT NULL,
    force public.execution_force NOT NULL,
    value integer NOT NULL,
    question_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT assessment_responses_value_check CHECK (((value >= 0) AND (value <= 5)))
);


ALTER TABLE public.assessment_responses OWNER TO postgres;

--
-- Name: TABLE assessment_responses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.assessment_responses IS 'Individual question responses for detailed analysis';


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    founder_id uuid NOT NULL,
    venture_id uuid,
    overall_score integer NOT NULL,
    force_thesis_integrity integer NOT NULL,
    force_learning_velocity integer NOT NULL,
    force_decision_quality integer NOT NULL,
    force_talent_gravity integer NOT NULL,
    force_delivery_control integer NOT NULL,
    force_resilience_economics integer NOT NULL,
    integrity_score integer,
    integrity_flags jsonb,
    integrity_checks jsonb,
    started_at timestamp with time zone,
    duration_seconds integer,
    assessment_version text DEFAULT 'v2.1'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT assessments_duration_seconds_check CHECK ((duration_seconds >= 0)),
    CONSTRAINT assessments_force_decision_quality_check CHECK (((force_decision_quality >= 0) AND (force_decision_quality <= 100))),
    CONSTRAINT assessments_force_delivery_control_check CHECK (((force_delivery_control >= 0) AND (force_delivery_control <= 100))),
    CONSTRAINT assessments_force_learning_velocity_check CHECK (((force_learning_velocity >= 0) AND (force_learning_velocity <= 100))),
    CONSTRAINT assessments_force_resilience_economics_check CHECK (((force_resilience_economics >= 0) AND (force_resilience_economics <= 100))),
    CONSTRAINT assessments_force_talent_gravity_check CHECK (((force_talent_gravity >= 0) AND (force_talent_gravity <= 100))),
    CONSTRAINT assessments_force_thesis_integrity_check CHECK (((force_thesis_integrity >= 0) AND (force_thesis_integrity <= 100))),
    CONSTRAINT assessments_integrity_score_check CHECK (((integrity_score >= 0) AND (integrity_score <= 100))),
    CONSTRAINT assessments_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100)))
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- Name: TABLE assessments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.assessments IS 'FounderFit assessments with 6 Execution Forces scores and Signal Integrity tracking';


--
-- Name: COLUMN assessments.force_thesis_integrity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_thesis_integrity IS 'Force A: Form, hold, and revise thesis without delusion';


--
-- Name: COLUMN assessments.force_learning_velocity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_learning_velocity IS 'Force B: Signal to model update to new behavior speed';


--
-- Name: COLUMN assessments.force_decision_quality; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_decision_quality IS 'Force C: Decision quality under incomplete data and high stakes';


--
-- Name: COLUMN assessments.force_talent_gravity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_talent_gravity IS 'Force D: Ability to attract, align, and retain talent';


--
-- Name: COLUMN assessments.force_delivery_control; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_delivery_control IS 'Force E: Reliability of output and operational closure';


--
-- Name: COLUMN assessments.force_resilience_economics; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.force_resilience_economics IS 'Force F: Managing energy and motivation without burnout';


--
-- Name: COLUMN assessments.integrity_score; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.integrity_score IS 'Signal Integrity score (0-100): Measures response quality and validity';


--
-- Name: COLUMN assessments.integrity_flags; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.integrity_flags IS 'Array of detected integrity issues (time_outlier, inconsistent_pair, straightlining, extreme_pattern)';


--
-- Name: COLUMN assessments.integrity_checks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.integrity_checks IS 'Detailed results from integrity validation checks';


--
-- Name: COLUMN assessments.started_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.started_at IS 'Timestamp when assessment was started (for completion time tracking)';


--
-- Name: COLUMN assessments.duration_seconds; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.assessments.duration_seconds IS 'Time taken to complete assessment (for integrity validation)';


--
-- Name: ventures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventures (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    founder_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    stage public.venture_stage DEFAULT 'idea'::public.venture_stage NOT NULL,
    outcome public.venture_outcome DEFAULT 'active'::public.venture_outcome NOT NULL,
    founded_date date,
    outcome_date date,
    outcome_notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ventures OWNER TO postgres;

--
-- Name: TABLE ventures; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.ventures IS 'Ventures associated with founders for outcome tracking';


--
-- Name: cohort_analysis; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.cohort_analysis AS
 SELECT v.outcome,
    v.stage,
    count(DISTINCT a.founder_id) AS founder_count,
    avg(a.overall_score) AS avg_overall_score,
    avg(a.force_thesis_integrity) AS avg_thesis_integrity,
    avg(a.force_learning_velocity) AS avg_learning_velocity,
    avg(a.force_decision_quality) AS avg_decision_quality,
    avg(a.force_talent_gravity) AS avg_talent_gravity,
    avg(a.force_delivery_control) AS avg_delivery_control,
    avg(a.force_resilience_economics) AS avg_resilience_economics,
    avg(a.integrity_score) AS avg_integrity_score,
    count(*) FILTER (WHERE (a.integrity_score >= 90)) AS excellent_integrity_count,
    count(*) FILTER (WHERE ((a.integrity_score >= 70) AND (a.integrity_score < 90))) AS good_integrity_count,
    count(*) FILTER (WHERE ((a.integrity_score >= 50) AND (a.integrity_score < 70))) AS questionable_integrity_count,
    count(*) FILTER (WHERE ((a.integrity_score < 50) AND (a.integrity_score IS NOT NULL))) AS poor_integrity_count
   FROM (public.ventures v
     JOIN public.assessments a ON ((v.id = a.venture_id)))
  GROUP BY v.outcome, v.stage;


ALTER VIEW public.cohort_analysis OWNER TO postgres;

--
-- Name: founders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.founders (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    role public.user_role DEFAULT 'founder'::public.user_role NOT NULL,
    auth_user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.founders OWNER TO postgres;

--
-- Name: TABLE founders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.founders IS 'Founder profiles linked to Supabase Auth';


--
-- Name: founder_assessment_history; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.founder_assessment_history AS
 SELECT f.id AS founder_id,
    f.name AS founder_name,
    f.email,
    a.id AS assessment_id,
    a.overall_score,
    a.force_thesis_integrity,
    a.force_learning_velocity,
    a.force_decision_quality,
    a.force_talent_gravity,
    a.force_delivery_control,
    a.force_resilience_economics,
    a.integrity_score,
    a.integrity_flags,
    a.duration_seconds,
    a.created_at AS assessment_date,
    a.started_at,
    v.name AS venture_name,
    v.stage AS venture_stage,
    v.outcome AS venture_outcome
   FROM ((public.founders f
     LEFT JOIN public.assessments a ON ((f.id = a.founder_id)))
     LEFT JOIN public.ventures v ON ((a.venture_id = v.id)))
  ORDER BY f.id, a.created_at DESC;


ALTER VIEW public.founder_assessment_history OWNER TO postgres;

--
-- Name: test_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    overall_score integer NOT NULL,
    dimension_scores jsonb NOT NULL,
    responses jsonb,
    test_taker_email text,
    test_taker_name text,
    user_name text,
    user_email text
);


ALTER TABLE public.test_reports OWNER TO postgres;

--
-- Name: COLUMN test_reports.user_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.test_reports.user_name IS 'Full name of the test subject';


--
-- Name: COLUMN test_reports.user_email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.test_reports.user_email IS 'Email address for result delivery';


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
e327e7ac-a3ed-4972-8dc4-2fbf33233557	e327e7ac-a3ed-4972-8dc4-2fbf33233557	{"sub": "e327e7ac-a3ed-4972-8dc4-2fbf33233557", "name": "Brett Bilon", "role": "founder", "email": "brett@plume.ca", "email_verified": true, "phone_verified": false}	email	2026-01-10 16:21:26.225507+00	2026-01-10 16:21:26.225583+00	2026-01-10 16:21:26.225583+00	98475a57-6d23-47f2-b22e-14e133936f5a
e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	{"sub": "e73889a4-8bfa-412b-81e2-ec8d3b4c9edc", "name": "Brett Bilon", "role": "founder", "email": "brettbilon@gmail.com", "email_verified": true, "phone_verified": false}	email	2026-02-07 15:10:50.635069+00	2026-02-07 15:10:50.63513+00	2026-02-07 15:10:50.63513+00	cf594eef-e5b9-41c5-8f82-91a37c94be59
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
d85646ec-4363-4815-be2f-39f958b37801	2026-01-10 16:26:13.623587+00	2026-01-10 16:26:13.623587+00	otp	4bb53387-4580-4ae3-821b-ba8b11dfba76
d57118cd-fdd3-48d1-b25d-712e78fd70cc	2026-01-10 17:50:43.250887+00	2026-01-10 17:50:43.250887+00	password	5f8d27ab-79f0-477a-886f-0402bbdf8732
d390af72-6ec8-444d-a9a4-c099a33fa5b6	2026-02-07 15:11:09.068957+00	2026-02-07 15:11:09.068957+00	otp	91e4f362-9f10-4b04-b72c-87963023304f
fdf4f70c-dff4-43fa-a19e-312896407edf	2026-02-07 15:11:21.638733+00	2026-02-07 15:11:21.638733+00	password	7a05a5ab-452b-4269-b83a-33f21d8637c6
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	ezxfs2f22h6r	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-10 16:26:13.619639+00	2026-01-10 17:34:27.376704+00	\N	d85646ec-4363-4815-be2f-39f958b37801
00000000-0000-0000-0000-000000000000	2	6sj6s7ezilmz	e327e7ac-a3ed-4972-8dc4-2fbf33233557	f	2026-01-10 17:34:27.377631+00	2026-01-10 17:34:27.377631+00	ezxfs2f22h6r	d85646ec-4363-4815-be2f-39f958b37801
00000000-0000-0000-0000-000000000000	3	dsxkqmpqgfjz	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-10 17:50:43.248806+00	2026-01-10 18:58:52.594429+00	\N	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	4	nbaatdquvb7w	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-10 18:58:52.595645+00	2026-01-10 20:00:12.730441+00	dsxkqmpqgfjz	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	5	7mrpacd3kjnn	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-10 20:00:12.73139+00	2026-01-10 22:02:47.417948+00	nbaatdquvb7w	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	6	z4ojc2g4w2nf	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-10 22:02:47.419058+00	2026-01-11 00:02:03.068653+00	7mrpacd3kjnn	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	7	mghhoojpizof	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-11 00:02:03.069769+00	2026-01-11 11:42:33.452716+00	z4ojc2g4w2nf	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	8	jfkhsd5qeing	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-11 11:42:33.454199+00	2026-01-11 12:46:22.903421+00	mghhoojpizof	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	9	yumzy7q4nvwx	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-11 12:46:22.904407+00	2026-01-11 13:51:46.30852+00	jfkhsd5qeing	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	10	oiza3swtzcqv	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-11 13:51:46.309646+00	2026-01-11 16:17:13.71985+00	yumzy7q4nvwx	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	11	5swqksmkq3as	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-11 16:17:13.721405+00	2026-01-12 11:27:49.063281+00	oiza3swtzcqv	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	12	i7evvkxuroza	e327e7ac-a3ed-4972-8dc4-2fbf33233557	t	2026-01-12 11:27:49.064198+00	2026-01-12 12:26:38.676164+00	5swqksmkq3as	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	13	nqmwnkkjkxr2	e327e7ac-a3ed-4972-8dc4-2fbf33233557	f	2026-01-12 12:26:38.677075+00	2026-01-12 12:26:38.677075+00	i7evvkxuroza	d57118cd-fdd3-48d1-b25d-712e78fd70cc
00000000-0000-0000-0000-000000000000	14	ugosyd775hkg	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	f	2026-02-07 15:11:09.059752+00	2026-02-07 15:11:09.059752+00	\N	d390af72-6ec8-444d-a9a4-c099a33fa5b6
00000000-0000-0000-0000-000000000000	15	xkrwbg25gvw2	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	t	2026-02-07 15:11:21.637315+00	2026-02-07 16:19:06.502701+00	\N	fdf4f70c-dff4-43fa-a19e-312896407edf
00000000-0000-0000-0000-000000000000	16	parw65xctuh6	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	t	2026-02-07 16:19:06.503565+00	2026-02-08 22:45:47.403067+00	xkrwbg25gvw2	fdf4f70c-dff4-43fa-a19e-312896407edf
00000000-0000-0000-0000-000000000000	17	vwpqpatoimj5	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	t	2026-02-08 22:45:47.4065+00	2026-02-21 20:37:57.184749+00	parw65xctuh6	fdf4f70c-dff4-43fa-a19e-312896407edf
00000000-0000-0000-0000-000000000000	18	tdacls7vs6ht	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	f	2026-02-21 20:37:57.194028+00	2026-02-21 20:37:57.194028+00	vwpqpatoimj5	fdf4f70c-dff4-43fa-a19e-312896407edf
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
d85646ec-4363-4815-be2f-39f958b37801	e327e7ac-a3ed-4972-8dc4-2fbf33233557	2026-01-10 16:26:13.616277+00	2026-01-10 17:34:27.380898+00	\N	aal1	\N	2026-01-10 17:34:27.380802	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0	38.30.151.174	\N	\N	\N	\N	\N
d57118cd-fdd3-48d1-b25d-712e78fd70cc	e327e7ac-a3ed-4972-8dc4-2fbf33233557	2026-01-10 17:50:43.247318+00	2026-01-12 12:26:38.680213+00	\N	aal1	\N	2026-01-12 12:26:38.680121	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0	38.30.151.174	\N	\N	\N	\N	\N
d390af72-6ec8-444d-a9a4-c099a33fa5b6	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	2026-02-07 15:11:09.053592+00	2026-02-07 15:11:09.053592+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0	38.30.151.174	\N	\N	\N	\N	\N
fdf4f70c-dff4-43fa-a19e-312896407edf	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	2026-02-07 15:11:21.636006+00	2026-02-21 20:37:57.206244+00	\N	aal1	\N	2026-02-21 20:37:57.206111	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	38.30.151.174	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	authenticated	authenticated	brettbilon@gmail.com	$2a$10$q1dDxBY9yKvt9qkWw77noucrWVn7QJg.PREpBXYcZShsUYHWAHV/S	2026-02-07 15:11:09.048801+00	\N		2026-02-07 15:10:50.64057+00		\N			\N	2026-02-07 15:11:21.63591+00	{"provider": "email", "providers": ["email"]}	{"sub": "e73889a4-8bfa-412b-81e2-ec8d3b4c9edc", "name": "Brett Bilon", "role": "founder", "email": "brettbilon@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-02-07 15:10:50.604046+00	2026-02-21 20:37:57.198118+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e327e7ac-a3ed-4972-8dc4-2fbf33233557	authenticated	authenticated	brett@plume.ca	$2a$10$HIrVXIfHTbzN1.42bahaE.GiAHi3OxWKC0G6G1rLmAtxpMgNUDCte	2026-01-10 16:26:13.610022+00	\N		2026-01-10 16:21:26.232944+00		\N			\N	2026-01-10 17:50:43.247223+00	{"provider": "email", "providers": ["email"]}	{"sub": "e327e7ac-a3ed-4972-8dc4-2fbf33233557", "name": "Brett Bilon", "role": "founder", "email": "brett@plume.ca", "email_verified": true, "phone_verified": false}	\N	2026-01-10 16:21:26.202626+00	2026-01-12 12:26:38.678404+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: assessment_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_responses (id, assessment_id, question_id, force, value, question_text, created_at) FROM stdin;
7dc25054-ed20-479b-b50e-f31a5390abd7	14ac87ad-1812-4a60-81d5-eb2fc9b57236	A1	thesis_integrity	5	I revise my startup thesis when new evidence contradicts it, even if the change is uncomfortable.	2026-01-10 20:00:14.723496+00
f438876d-f0c8-47be-9b3e-f5ef9c9ebaac	14ac87ad-1812-4a60-81d5-eb2fc9b57236	A2	thesis_integrity	5	I can clearly articulate why my startup will succeed where others have failed.	2026-01-10 20:00:14.723496+00
c72a3e61-363c-4dcd-9598-d302018a1453	14ac87ad-1812-4a60-81d5-eb2fc9b57236	B1	learning_velocity	5	I regularly change my approach based on new information from customers or the market.	2026-01-10 20:00:14.723496+00
be64a0a1-5787-4a26-b8a6-12f6bd6b4301	14ac87ad-1812-4a60-81d5-eb2fc9b57236	B2	learning_velocity	5	When something isn't working, I quickly run experiments to find a better solution.	2026-01-10 20:00:14.723496+00
0090406f-8af2-4ac7-982e-374494c38b71	14ac87ad-1812-4a60-81d5-eb2fc9b57236	C1	decision_quality_under_load	4	I make clear decisions even when under significant time pressure or uncertainty.	2026-01-10 20:00:14.723496+00
34acb0e5-c5d2-4bcd-9007-ec270c93a87c	14ac87ad-1812-4a60-81d5-eb2fc9b57236	C2	decision_quality_under_load	4	When facing multiple urgent issues, I consistently prioritize the right problems to solve first.	2026-01-10 20:00:14.723496+00
b6927a83-7146-4f20-9627-4296f006bf6a	14ac87ad-1812-4a60-81d5-eb2fc9b57236	D1	talent_gravity	4	Top candidates often tell me they want to work with me because of my vision or leadership.	2026-01-10 20:00:14.723496+00
3983421b-0918-4e96-b8a1-2932ca65aab2	14ac87ad-1812-4a60-81d5-eb2fc9b57236	D2	talent_gravity	4	People on my team consistently grow and develop their skills over time.	2026-01-10 20:00:14.723496+00
ff892283-304f-4a8c-90e5-fef4636a9bc8	14ac87ad-1812-4a60-81d5-eb2fc9b57236	E1	delivery_control	4	When I commit to shipping something by a specific date, it ships on time.	2026-01-10 20:00:14.723496+00
99b1b278-2527-47c6-8790-9804333a4568	14ac87ad-1812-4a60-81d5-eb2fc9b57236	E2	delivery_control	4	I systematically track progress on key initiatives and ensure follow-through.	2026-01-10 20:00:14.723496+00
de1b250d-4812-43e4-ab59-54cfbd2918b7	14ac87ad-1812-4a60-81d5-eb2fc9b57236	F1	resilience_economics	5	I maintain consistent energy and focus even during prolonged periods of high stress.	2026-01-10 20:00:14.723496+00
8b180400-02fa-47b2-a29b-4854021edaab	14ac87ad-1812-4a60-81d5-eb2fc9b57236	F2	resilience_economics	5	I have sustainable practices that help me recover quickly from setbacks or failures.	2026-01-10 20:00:14.723496+00
a1084614-29b3-46d3-8ace-1512d0b34fd6	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A1	thesis_integrity	5	When evidence challenges my core assumptions, I tend to:	2026-01-11 00:12:39.004473+00
3cc5bb4a-f4a0-4a84-aea4-6793ca5cb9ba	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A2	thesis_integrity	5	When explaining why my company will succeed, I usually emphasize:	2026-01-11 00:12:39.004473+00
a901c9fe-e536-43f4-a5f3-83a7cfa6edf9	a4cf1849-8b96-4c06-b59f-3339fd5cb877	B1	learning_velocity	4	After receiving new customer or market feedback, I usually:	2026-01-11 00:12:39.004473+00
48096906-33fc-4efe-b777-40810f59b947	a4cf1849-8b96-4c06-b59f-3339fd5cb877	B2	learning_velocity	5	When something isn't working, I'm more inclined to:	2026-01-11 00:12:39.004473+00
145f9503-4941-4af5-a413-ad3f6efe6f66	a4cf1849-8b96-4c06-b59f-3339fd5cb877	C1	decision_quality_under_load	5	Under time pressure, I'm more likely to:	2026-01-11 00:12:39.004473+00
b10b3d0f-76c3-4d27-817e-b569884d8d5d	a4cf1849-8b96-4c06-b59f-3339fd5cb877	C2	decision_quality_under_load	5	When several urgent problems compete for attention, I usually start by:	2026-01-11 00:12:39.004473+00
8e7787df-737b-4d37-ad65-a1cbca57d7da	a4cf1849-8b96-4c06-b59f-3339fd5cb877	D1	talent_gravity	4	When strong candidates hesitate to join, I usually assume it's because:	2026-01-11 00:12:39.004473+00
bfb10eac-0cc9-44da-a1f0-2051ef9403f4	a4cf1849-8b96-4c06-b59f-3339fd5cb877	D2	talent_gravity	5	When someone on my team underperforms, my first instinct is to:	2026-01-11 00:12:39.004473+00
1afa8c1b-1630-4361-9545-db75904f61b7	a4cf1849-8b96-4c06-b59f-3339fd5cb877	E1	delivery_control	4	When deadlines slip, it's usually because:	2026-01-11 00:12:39.004473+00
c95e39b1-2800-41af-9ac7-f527e7fa6623	a4cf1849-8b96-4c06-b59f-3339fd5cb877	E2	delivery_control	4	I prefer execution systems that:	2026-01-11 00:12:39.004473+00
c13a1319-d8af-4a9b-8fdd-c8136eda893d	a4cf1849-8b96-4c06-b59f-3339fd5cb877	F1	resilience_economics	5	During prolonged stress, I tend to:	2026-01-11 00:12:39.004473+00
b64c8436-98fa-4175-87e0-8f40c38969b3	a4cf1849-8b96-4c06-b59f-3339fd5cb877	F2	resilience_economics	1	After a significant setback, I usually:	2026-01-11 00:12:39.004473+00
f9a5c1bd-958c-414f-a5dd-2add89dca56c	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_FINAL	thesis_integrity	1	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-01-11 00:12:39.004473+00
af3135de-0604-4b96-a48b-8be33a4f9e42	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q2	thesis_integrity	1	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-01-11 00:12:39.004473+00
3ee7ab1d-942c-444d-969f-94696aa06c88	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q3	thesis_integrity	1	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-01-11 00:12:39.004473+00
3daf9d50-3b68-4851-9365-22f6dbdf5210	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q4	thesis_integrity	2	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-01-11 00:12:39.004473+00
9dd920fc-c525-4914-8473-bab97b89671a	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q5	thesis_integrity	3	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-01-11 00:12:39.004473+00
06b8848c-a9b3-43ea-89c6-0fd8e0940079	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q6	thesis_integrity	1	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-01-11 00:12:39.004473+00
8e424faa-1655-494f-92c7-d4a9057aa4ca	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q7	thesis_integrity	3	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-01-11 00:12:39.004473+00
73d63496-43ee-4323-b15f-2d023172e11d	a4cf1849-8b96-4c06-b59f-3339fd5cb877	A_TI_Q8	thesis_integrity	3	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-01-11 00:12:39.004473+00
6090ed72-4232-4e23-92df-d7e47d3fca1c	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A1b	thesis_integrity	2	When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.	2026-01-11 13:28:49.127822+00
f86cc986-736e-4364-9b6a-16c798e9a07f	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A2a	thesis_integrity	4	When explaining why my company will succeed, I emphasize conviction in the insight and vision.	2026-01-11 13:28:49.127822+00
88a29713-bfea-4f46-b63c-94b204636ef4	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A2b	thesis_integrity	2	When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.	2026-01-11 13:28:49.127822+00
e2cb8273-4fa3-44b2-906f-572496bf20b4	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	B1a	learning_velocity	2	After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.	2026-01-11 13:28:49.127822+00
58b10c4e-2f5d-4550-9c57-55308ed35ad2	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	B1b	learning_velocity	4	After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.	2026-01-11 13:28:49.127822+00
f2ea7b01-461c-4c52-836c-f1cbf51b0c9a	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	B2a	learning_velocity	2	When something isn't working, I spend time diagnosing the root cause before acting.	2026-01-11 13:28:49.127822+00
3ffe7edc-126f-4cf8-9dbb-c1579ec1da5c	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	B2b	learning_velocity	5	When something isn't working, I launch experiments immediately and learn by doing.	2026-01-11 13:28:49.127822+00
50ca1d50-00da-46ff-b395-1aa72ec81854	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	C1a	decision_quality_under_load	4	Under time pressure, I make a call quickly to preserve momentum.	2026-01-11 13:28:49.127822+00
3d6787b4-482c-4bba-acc6-cb40de624b83	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	C1b	decision_quality_under_load	4	Under time pressure, I delay decisions if acting too early risks compounding mistakes.	2026-01-11 13:28:49.127822+00
1bb4939e-dbcb-4424-820e-d886f1f71beb	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	C2a	decision_quality_under_load	2	When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.	2026-01-11 13:28:49.127822+00
9b298ddd-457a-4a9b-a3ec-fc81e5e0cae6	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	C2b	decision_quality_under_load	4	When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.	2026-01-11 13:28:49.127822+00
487f45f6-8b85-4082-9de0-f849e31b123a	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	D1a	talent_gravity	4	When strong candidates hesitate to join, I assume they don't yet see the upside or vision.	2026-01-11 13:28:49.127822+00
093df95d-3011-4b15-9015-90e7b64cb492	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	D1b	talent_gravity	4	When strong candidates hesitate to join, I assume I haven't created enough clarity or trust.	2026-01-11 13:28:49.127822+00
9857ec13-fab8-4707-a667-12331575c9bc	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	D2a	talent_gravity	1	When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.	2026-01-11 13:28:49.127822+00
1ec41332-819f-4fc0-92b6-bfb52b9a4541	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	D2b	talent_gravity	5	When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.	2026-01-11 13:28:49.127822+00
2595fff7-0d9b-4613-8cbe-03bf3f9a6d09	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	E1a	delivery_control	2	When deadlines slip, it's usually because the bar for quality changed.	2026-01-11 13:28:49.127822+00
bdb313c6-f2bd-4363-a0f7-96a413450c8b	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	E1b	delivery_control	5	When deadlines slip, it's usually because the original plan underestimated complexity.	2026-01-11 13:28:49.127822+00
96d2829a-26d6-4b19-ad9d-81a0c6c5cb22	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	E2a	delivery_control	2	I prefer execution systems that stay lightweight and flexible.	2026-01-11 13:28:49.127822+00
a032ff7c-5b33-45a4-8e77-a9591ec60fdf	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	E2b	delivery_control	4	I prefer execution systems that enforce discipline and accountability.	2026-01-11 13:28:49.127822+00
8cb13efa-3a45-44c9-adc1-031f03abd2ed	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	F1a	resilience_economics	2	During prolonged stress, I push through and deal with recovery later.	2026-01-11 13:28:49.127822+00
e224f0e2-fef5-45e3-8062-d23f9ad83b97	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	F1b	resilience_economics	4	During prolonged stress, I adjust pace early to preserve long-term stamina.	2026-01-11 13:28:49.127822+00
5d7cd20d-fcb0-47ed-bca8-7b243d62a859	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	F2a	resilience_economics	4	After a significant setback, I refocus immediately on the next objective.	2026-01-11 13:28:49.127822+00
420cf4d8-6a90-45ee-a2c5-13b2c7e9f5fc	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	F2b	resilience_economics	2	After a significant setback, I deliberately slow down to extract lessons.	2026-01-11 13:28:49.127822+00
e913fc79-d5f4-41b6-9c39-b481a8db6711	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_FINAL	thesis_integrity	0	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-01-11 13:28:49.127822+00
21b006df-cafb-40c8-94c8-3e10daba6d08	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q2	thesis_integrity	1	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-01-11 13:28:49.127822+00
fffed2b5-5169-4745-afe4-4480f99744e0	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q3	thesis_integrity	2	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-01-11 13:28:49.127822+00
60193b02-4d30-4bc7-a6a3-5d59b2753585	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q4	thesis_integrity	2	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-01-11 13:28:49.127822+00
83e32206-080f-4817-8567-a85d7fd6fad0	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q5	thesis_integrity	3	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-01-11 13:28:49.127822+00
826935b3-83e3-4aa0-a0a7-1209e6295820	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q6	thesis_integrity	2	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-01-11 13:28:49.127822+00
0a6ef38c-1489-4b46-937f-d77043de9635	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q7	thesis_integrity	2	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-01-11 13:28:49.127822+00
9f5116d5-6ff4-46fd-990f-df3b89912c44	6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	A_TI_Q8	thesis_integrity	2	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-01-11 13:28:49.127822+00
fadd968f-1305-4045-9dcf-b2fcf92e3c07	f903166e-f8ea-4a02-9a43-8241abd44637	A1b	thesis_integrity	2	When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.	2026-01-11 13:28:49.294856+00
ac7c21f4-92d4-46ff-8a0d-3f986e451d37	f903166e-f8ea-4a02-9a43-8241abd44637	A2a	thesis_integrity	4	When explaining why my company will succeed, I emphasize conviction in the insight and vision.	2026-01-11 13:28:49.294856+00
8663d29c-a753-49d0-8850-ff41c1daf3f9	f903166e-f8ea-4a02-9a43-8241abd44637	A2b	thesis_integrity	2	When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.	2026-01-11 13:28:49.294856+00
64759257-021b-404d-b6d7-db9b846f3f31	f903166e-f8ea-4a02-9a43-8241abd44637	B1a	learning_velocity	2	After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.	2026-01-11 13:28:49.294856+00
f7a965ef-ce68-4e4c-96f5-7698c5dd8996	f903166e-f8ea-4a02-9a43-8241abd44637	B1b	learning_velocity	4	After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.	2026-01-11 13:28:49.294856+00
83d71fdd-f926-475e-93e1-f4ad16a1f501	f903166e-f8ea-4a02-9a43-8241abd44637	B2a	learning_velocity	2	When something isn't working, I spend time diagnosing the root cause before acting.	2026-01-11 13:28:49.294856+00
f32d0ed0-f690-4805-9c7b-0437350ce09c	f903166e-f8ea-4a02-9a43-8241abd44637	B2b	learning_velocity	5	When something isn't working, I launch experiments immediately and learn by doing.	2026-01-11 13:28:49.294856+00
0bcfe78e-7ada-47be-b630-4b615294ecdc	f903166e-f8ea-4a02-9a43-8241abd44637	C1a	decision_quality_under_load	4	Under time pressure, I make a call quickly to preserve momentum.	2026-01-11 13:28:49.294856+00
04976572-52ec-4275-a728-e17c0a2c844b	f903166e-f8ea-4a02-9a43-8241abd44637	C1b	decision_quality_under_load	4	Under time pressure, I delay decisions if acting too early risks compounding mistakes.	2026-01-11 13:28:49.294856+00
d341fd27-3aea-4415-9a54-8820c58f06ec	f903166e-f8ea-4a02-9a43-8241abd44637	C2a	decision_quality_under_load	2	When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.	2026-01-11 13:28:49.294856+00
0380d1a0-9a2c-44ae-8170-b9e1a5451904	f903166e-f8ea-4a02-9a43-8241abd44637	C2b	decision_quality_under_load	4	When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.	2026-01-11 13:28:49.294856+00
232f7ed1-7f8e-4e27-b3bf-7f442e6c1942	f903166e-f8ea-4a02-9a43-8241abd44637	D1a	talent_gravity	4	When strong candidates hesitate to join, I assume they don't yet see the upside or vision.	2026-01-11 13:28:49.294856+00
c42775ad-1677-4c88-b54b-93a96f6156cc	f903166e-f8ea-4a02-9a43-8241abd44637	D1b	talent_gravity	4	When strong candidates hesitate to join, I assume I haven't created enough clarity or trust.	2026-01-11 13:28:49.294856+00
14d74b36-038c-4a87-8ff5-e634e6169652	f903166e-f8ea-4a02-9a43-8241abd44637	D2a	talent_gravity	1	When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.	2026-01-11 13:28:49.294856+00
89fc34f5-2e26-4578-ba27-ae704847ceb4	f903166e-f8ea-4a02-9a43-8241abd44637	D2b	talent_gravity	5	When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.	2026-01-11 13:28:49.294856+00
528645cd-ca70-4798-8822-3fad5737533f	f903166e-f8ea-4a02-9a43-8241abd44637	E1a	delivery_control	2	When deadlines slip, it's usually because the bar for quality changed.	2026-01-11 13:28:49.294856+00
201edb62-b1f2-423a-99f7-5d0d3a272342	f903166e-f8ea-4a02-9a43-8241abd44637	E1b	delivery_control	5	When deadlines slip, it's usually because the original plan underestimated complexity.	2026-01-11 13:28:49.294856+00
3786f048-2414-45b7-a52d-2ea700927aa0	f903166e-f8ea-4a02-9a43-8241abd44637	E2a	delivery_control	2	I prefer execution systems that stay lightweight and flexible.	2026-01-11 13:28:49.294856+00
af9ceb9d-103f-464d-ae03-7bd9589c220a	f903166e-f8ea-4a02-9a43-8241abd44637	E2b	delivery_control	4	I prefer execution systems that enforce discipline and accountability.	2026-01-11 13:28:49.294856+00
9bdd9d4f-0e3f-4075-9a9a-c678dd2cbff0	f903166e-f8ea-4a02-9a43-8241abd44637	F1a	resilience_economics	2	During prolonged stress, I push through and deal with recovery later.	2026-01-11 13:28:49.294856+00
7ef75cc0-b20a-4cb5-b6bf-57f2cd487a48	f903166e-f8ea-4a02-9a43-8241abd44637	F1b	resilience_economics	4	During prolonged stress, I adjust pace early to preserve long-term stamina.	2026-01-11 13:28:49.294856+00
30bc5188-c1b9-4390-9d7c-468c5707ed91	f903166e-f8ea-4a02-9a43-8241abd44637	F2a	resilience_economics	4	After a significant setback, I refocus immediately on the next objective.	2026-01-11 13:28:49.294856+00
50c6805e-f633-4709-871f-e9962ccb5a9d	f903166e-f8ea-4a02-9a43-8241abd44637	F2b	resilience_economics	2	After a significant setback, I deliberately slow down to extract lessons.	2026-01-11 13:28:49.294856+00
1fd926f1-2882-45eb-842d-fa81d417d59f	f903166e-f8ea-4a02-9a43-8241abd44637	A_FINAL	thesis_integrity	0	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-01-11 13:28:49.294856+00
611b5bd4-c24c-49d2-9493-3c19694dd7d0	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q2	thesis_integrity	1	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-01-11 13:28:49.294856+00
ae39507c-ac8e-4096-b785-bfbfdc4917ed	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q3	thesis_integrity	2	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-01-11 13:28:49.294856+00
a57d640d-acf4-4b8b-afb0-29d166a801cc	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q4	thesis_integrity	2	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-01-11 13:28:49.294856+00
c922fd55-2034-468b-b62e-4909407327d5	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q5	thesis_integrity	3	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-01-11 13:28:49.294856+00
450ae793-db35-4d49-a1ff-b8c76a937fb7	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q6	thesis_integrity	2	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-01-11 13:28:49.294856+00
fce637f6-ea4f-441f-a4aa-0c84f67c583b	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q7	thesis_integrity	2	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-01-11 13:28:49.294856+00
1ffb7f41-7726-49f3-8cce-e3d0b5dff6f2	f903166e-f8ea-4a02-9a43-8241abd44637	A_TI_Q8	thesis_integrity	2	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-01-11 13:28:49.294856+00
22e3794b-5afc-4dfb-affe-2b1cf1bc22c3	c77750d3-3572-4fe2-b094-4774c7155c12	A1a	thesis_integrity	5	When evidence challenges my core assumptions, I defend the original explanation unless the contradiction is overwhelming.	2026-01-11 16:18:02.031264+00
a46559d8-cd97-4d95-b521-87e345a476db	c77750d3-3572-4fe2-b094-4774c7155c12	A1b	thesis_integrity	2	When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.	2026-01-11 16:18:02.031264+00
ed8ca48c-c81e-4e32-bb02-4df366f3b8ab	c77750d3-3572-4fe2-b094-4774c7155c12	A2a	thesis_integrity	5	When explaining why my company will succeed, I emphasize conviction in the insight and vision.	2026-01-11 16:18:02.031264+00
e67c5f29-7d84-46c0-8894-ecd11a9d4e56	c77750d3-3572-4fe2-b094-4774c7155c12	A2b	thesis_integrity	5	When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.	2026-01-11 16:18:02.031264+00
1fb919d6-e060-4bff-bcf2-99115ab27ba2	c77750d3-3572-4fe2-b094-4774c7155c12	B1a	learning_velocity	5	After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.	2026-01-11 16:18:02.031264+00
f83c4c57-9756-40e7-b6b0-bcb0759029c9	c77750d3-3572-4fe2-b094-4774c7155c12	B1b	learning_velocity	5	After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.	2026-01-11 16:18:02.031264+00
ee57e5d0-9ff7-4a26-9d9b-452252857928	c77750d3-3572-4fe2-b094-4774c7155c12	B2a	learning_velocity	5	When something isn't working, I spend time diagnosing the root cause before acting.	2026-01-11 16:18:02.031264+00
b6c82120-88cb-400d-b7ec-6291ba75ab94	c77750d3-3572-4fe2-b094-4774c7155c12	B2b	learning_velocity	5	When something isn't working, I launch experiments immediately and learn by doing.	2026-01-11 16:18:02.031264+00
f64d07d0-8062-4ef9-93bb-4ddefab07f26	c77750d3-3572-4fe2-b094-4774c7155c12	C1a	decision_quality_under_load	5	Under time pressure, I make a call quickly to preserve momentum.	2026-01-11 16:18:02.031264+00
3d9ce23a-85a2-4846-acdd-ac089a46bfdd	c77750d3-3572-4fe2-b094-4774c7155c12	C1b	decision_quality_under_load	5	Under time pressure, I delay decisions if acting too early risks compounding mistakes.	2026-01-11 16:18:02.031264+00
c7b102f8-a518-4b29-aa0d-94bcb74797c0	c77750d3-3572-4fe2-b094-4774c7155c12	C2a	decision_quality_under_load	5	When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.	2026-01-11 16:18:02.031264+00
2310a2a2-c5a9-4b78-af76-9dbc8372510b	c77750d3-3572-4fe2-b094-4774c7155c12	C2b	decision_quality_under_load	5	When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.	2026-01-11 16:18:02.031264+00
bf9906d2-8e3c-4c0b-814b-d9127c315076	c77750d3-3572-4fe2-b094-4774c7155c12	D1a	talent_gravity	5	When strong candidates hesitate to join, I assume they don't yet see the upside or vision.	2026-01-11 16:18:02.031264+00
ad2913d6-e99f-453f-a1da-cabc3563a2e8	c77750d3-3572-4fe2-b094-4774c7155c12	D1b	talent_gravity	5	When strong candidates hesitate to join, I assume I haven't created enough clarity or trust.	2026-01-11 16:18:02.031264+00
61cf89c5-4f33-42da-b460-436365f6ee70	c77750d3-3572-4fe2-b094-4774c7155c12	D2a	talent_gravity	5	When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.	2026-01-11 16:18:02.031264+00
aa0de524-9e5e-45ed-8aa1-ff4a161e405a	c77750d3-3572-4fe2-b094-4774c7155c12	D2b	talent_gravity	5	When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.	2026-01-11 16:18:02.031264+00
86c16759-6693-4598-b1c4-0e04f262b727	c77750d3-3572-4fe2-b094-4774c7155c12	E1a	delivery_control	5	When deadlines slip, it's usually because the bar for quality changed.	2026-01-11 16:18:02.031264+00
65a18dda-ad43-4365-85ee-0063ddd2c22b	c77750d3-3572-4fe2-b094-4774c7155c12	E1b	delivery_control	5	When deadlines slip, it's usually because the original plan underestimated complexity.	2026-01-11 16:18:02.031264+00
4a8f076e-ee23-448e-b736-5b6ab02e77a8	c77750d3-3572-4fe2-b094-4774c7155c12	E2a	delivery_control	5	I prefer execution systems that stay lightweight and flexible.	2026-01-11 16:18:02.031264+00
4244f4ff-93ce-4a53-b838-67cdd99c9606	c77750d3-3572-4fe2-b094-4774c7155c12	E2b	delivery_control	5	I prefer execution systems that enforce discipline and accountability.	2026-01-11 16:18:02.031264+00
50dc73f0-17c5-46d0-a796-af194f325adc	c77750d3-3572-4fe2-b094-4774c7155c12	F1a	resilience_economics	5	During prolonged stress, I push through and deal with recovery later.	2026-01-11 16:18:02.031264+00
f9cdc542-54ef-42ba-9e78-a514dce34549	c77750d3-3572-4fe2-b094-4774c7155c12	F1b	resilience_economics	5	During prolonged stress, I adjust pace early to preserve long-term stamina.	2026-01-11 16:18:02.031264+00
a010e8c7-cf9d-4356-9a91-6c0869f59694	c77750d3-3572-4fe2-b094-4774c7155c12	F2a	resilience_economics	5	After a significant setback, I refocus immediately on the next objective.	2026-01-11 16:18:02.031264+00
3a822649-21b7-43ab-8629-1d133f720758	c77750d3-3572-4fe2-b094-4774c7155c12	F2b	resilience_economics	5	After a significant setback, I deliberately slow down to extract lessons.	2026-01-11 16:18:02.031264+00
476af9a4-e2db-4fa2-88e8-d5aa3596644e	c77750d3-3572-4fe2-b094-4774c7155c12	A_FINAL	thesis_integrity	3	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-01-11 16:18:02.031264+00
88be9b99-1e8e-4a39-8ad1-9533fb7e2458	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q2	thesis_integrity	3	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-01-11 16:18:02.031264+00
285ebc69-dc70-4c6c-8bde-f0e44d192d56	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q3	thesis_integrity	3	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-01-11 16:18:02.031264+00
2e1520ed-6fec-4cd0-a0d9-36268d01267e	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q4	thesis_integrity	3	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-01-11 16:18:02.031264+00
0e7ea4f3-9ec7-4673-85d8-5be31c30654f	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q5	thesis_integrity	3	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-01-11 16:18:02.031264+00
689edfcd-03e7-4e82-b6a0-0800bd695509	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q6	thesis_integrity	3	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-01-11 16:18:02.031264+00
6dd606df-49ed-4622-b9d4-a1e1781782c0	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q7	thesis_integrity	3	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-01-11 16:18:02.031264+00
43306e8d-68e8-4419-9c85-0476cddc2aff	c77750d3-3572-4fe2-b094-4774c7155c12	A_TI_Q8	thesis_integrity	3	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-01-11 16:18:02.031264+00
b569528c-568a-4370-bea7-ae90262ce5cd	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A1a	thesis_integrity	4	When evidence challenges my core assumptions, I defend the original explanation unless the contradiction is overwhelming.	2026-01-12 12:22:18.6618+00
26066444-d28c-4bf9-956f-b69da562d802	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A1b	thesis_integrity	1	When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.	2026-01-12 12:22:18.6618+00
17b8887a-eb19-4c0f-a19b-a9d7f68610f6	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A2a	thesis_integrity	5	When explaining why my company will succeed, I emphasize conviction in the insight and vision.	2026-01-12 12:22:18.6618+00
9871674d-72d3-410f-8ef7-f8f9e3e388ed	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	B1a	learning_velocity	2	After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.	2026-01-12 12:22:18.6618+00
2df3cb46-636b-4741-87f1-c1c8f0aa1ebe	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	B1b	learning_velocity	2	After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.	2026-01-12 12:22:18.6618+00
21632f98-7b55-4721-b53e-2ec7ca2129ff	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	D2a	talent_gravity	1	When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.	2026-01-12 12:22:18.6618+00
d41cbe73-42bf-4a7d-bad5-d90cc1a2f902	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	C1b	decision_quality_under_load	2	Under time pressure, I delay decisions if acting too early risks compounding mistakes.	2026-01-12 12:22:18.6618+00
3c40f56c-73f7-451d-a0d2-30e9bedb9bb5	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	F1a	resilience_economics	5	During prolonged stress, I push through and deal with recovery later.	2026-01-12 12:22:18.6618+00
0aebbe02-07cc-4453-b201-0b16929c9a66	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A2b	thesis_integrity	1	When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.	2026-01-12 12:22:18.6618+00
affafa48-c091-468b-b511-7c1be292a2c2	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	D1a	talent_gravity	2	When strong candidates hesitate to join, I assume they don't yet see the upside or vision.	2026-01-12 12:22:18.6618+00
7cf04833-d4c9-4207-8b5e-d21be9d54b1a	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	B2b	learning_velocity	5	When something isn't working, I launch experiments immediately and learn by doing.	2026-01-12 12:22:18.6618+00
0e2266fd-0d34-4e59-ae64-abb928a02c7f	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	E1a	delivery_control	1	When deadlines slip, it's usually because the bar for quality changed.	2026-01-12 12:22:18.6618+00
446a78b7-1ef2-4f5f-a8b9-a531f3aacd58	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	F2b	resilience_economics	2	After a significant setback, I deliberately slow down to extract lessons.	2026-01-12 12:22:18.6618+00
1cadfa1e-8f76-4e4f-a219-a5baa0673484	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	C2b	decision_quality_under_load	2	When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.	2026-01-12 12:22:18.6618+00
7dc430c4-6adb-4e8f-a057-64c10d9d6465	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	E2a	delivery_control	4	I prefer execution systems that stay lightweight and flexible.	2026-01-12 12:22:18.6618+00
51b891a6-2b75-401c-91df-842c08306461	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	D1b	talent_gravity	5	When strong candidates hesitate to join, I assume I haven't created enough clarity or trust.	2026-01-12 12:22:18.6618+00
cebe9402-1bce-4053-9892-0417e928d15f	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	F1b	resilience_economics	4	During prolonged stress, I adjust pace early to preserve long-term stamina.	2026-01-12 12:22:18.6618+00
248b90d2-7cf1-41c5-af6e-8d7ffae9d7c1	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	C1a	decision_quality_under_load	5	Under time pressure, I make a call quickly to preserve momentum.	2026-01-12 12:22:18.6618+00
5d339acd-73b3-4bc7-8f8c-2f44b75f2cba	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	E2b	delivery_control	2	I prefer execution systems that enforce discipline and accountability.	2026-01-12 12:22:18.6618+00
ddfe621b-2e81-401e-84b3-5b57277e4aab	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	F2a	resilience_economics	5	After a significant setback, I refocus immediately on the next objective.	2026-01-12 12:22:18.6618+00
4d66151e-6a36-42c8-9e80-3d20140a56d7	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	C2a	decision_quality_under_load	2	When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.	2026-01-12 12:22:18.6618+00
94ce2bc0-1c0c-472b-9b51-be985c8c715f	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	D2b	talent_gravity	4	When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.	2026-01-12 12:22:18.6618+00
b22894eb-51de-4bd2-b599-097f0f9be2db	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	B2a	learning_velocity	4	When something isn't working, I spend time diagnosing the root cause before acting.	2026-01-12 12:22:18.6618+00
17097b75-0fd2-4aa2-a2d2-f196864e4c65	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	E1b	delivery_control	5	When deadlines slip, it's usually because the original plan underestimated complexity.	2026-01-12 12:22:18.6618+00
af01ebcb-66cc-49a7-b5cb-4b357fa79d00	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_FINAL	thesis_integrity	3	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-01-12 12:22:18.6618+00
79167d49-243c-4e9e-afae-4b02de1341ef	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q2	thesis_integrity	3	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-01-12 12:22:18.6618+00
f3c45fb0-66c5-40ad-8a75-3f1a4e88498d	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q3	thesis_integrity	3	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-01-12 12:22:18.6618+00
571ef10f-3d26-4a3d-b2de-fb554ddff5cc	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q4	thesis_integrity	3	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-01-12 12:22:18.6618+00
535bfc59-4338-4829-ad79-c5d47e5a7820	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q5	thesis_integrity	3	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-01-12 12:22:18.6618+00
aded3c4c-13ad-4e89-a1cf-39cf0cbcb9f5	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q6	thesis_integrity	3	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-01-12 12:22:18.6618+00
a0d8e8d4-91ef-47b3-bdfe-96ed79491a5d	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q7	thesis_integrity	3	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-01-12 12:22:18.6618+00
1452c67d-6b40-4dfb-b265-117d20fe98b2	4c788d64-cd86-4a90-aa6f-82edc6bb10b2	A_TI_Q8	thesis_integrity	3	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-01-12 12:22:18.6618+00
78c2dff6-dc91-446b-a8ca-806cec827b4a	331e2675-9fa9-4145-ae8e-159619935619	C1b	decision_quality_under_load	1	Under time pressure, I delay decisions if acting too early risks compounding mistakes.	2026-02-07 15:19:42.630133+00
a26f162b-7d29-4b71-b8b0-711bb8756829	331e2675-9fa9-4145-ae8e-159619935619	F1a	resilience_economics	4	During prolonged stress, I push through and deal with recovery later.	2026-02-07 15:19:42.630133+00
fa061d28-730c-474d-9ca7-24cbb8a6856d	331e2675-9fa9-4145-ae8e-159619935619	A2b	thesis_integrity	1	When explaining why my company will succeed, I emphasize the specific conditions under which the thesis might fail.	2026-02-07 15:19:42.630133+00
92e28317-5371-4b34-b5db-0175c6750557	331e2675-9fa9-4145-ae8e-159619935619	D1a	talent_gravity	5	When strong candidates hesitate to join, I assume they don't yet see the upside or vision.	2026-02-07 15:19:42.630133+00
655ab31c-d8a7-4117-88cf-9e6e439c0d03	331e2675-9fa9-4145-ae8e-159619935619	B2b	learning_velocity	5	When something isn't working, I launch experiments immediately and learn by doing.	2026-02-07 15:19:42.630133+00
8faed2e7-a577-4c54-b8ae-fc9b38be6805	331e2675-9fa9-4145-ae8e-159619935619	E1a	delivery_control	1	When deadlines slip, it's usually because the bar for quality changed.	2026-02-07 15:19:42.630133+00
d6bee8c2-5550-47fe-bbe2-85f26538f0d7	331e2675-9fa9-4145-ae8e-159619935619	A1b	thesis_integrity	1	When evidence challenges my core assumptions, I actively revise the explanation even if it weakens narrative clarity.	2026-02-07 15:19:42.630133+00
9dbd871b-08d4-4141-8778-9db9a4d36a67	331e2675-9fa9-4145-ae8e-159619935619	D2a	talent_gravity	1	When someone on my team underperforms, my first instinct is to replace them quickly to maintain standards.	2026-02-07 15:19:42.630133+00
08769124-69ac-4f2e-95c5-0ffe47ebbc55	331e2675-9fa9-4145-ae8e-159619935619	F2b	resilience_economics	2	After a significant setback, I deliberately slow down to extract lessons.	2026-02-07 15:19:42.630133+00
d47f3e7e-cb76-4688-afb3-61c2e7951e5c	331e2675-9fa9-4145-ae8e-159619935619	B1a	learning_velocity	2	After receiving new customer or market feedback, I let it accumulate until a clear pattern emerges.	2026-02-07 15:19:42.630133+00
58e127d4-2473-44e1-94d4-d1d08631fcbe	331e2675-9fa9-4145-ae8e-159619935619	C2b	decision_quality_under_load	4	When several urgent problems compete for attention, I start by clarifying which problems are least understood before acting.	2026-02-07 15:19:42.630133+00
b23d9f83-26ef-4832-bb7e-24c6f762eb1a	331e2675-9fa9-4145-ae8e-159619935619	E2a	delivery_control	5	I prefer execution systems that stay lightweight and flexible.	2026-02-07 15:19:42.630133+00
beb30565-bb91-4466-995d-e9210ca35efd	331e2675-9fa9-4145-ae8e-159619935619	A2a	thesis_integrity	2	When explaining why my company will succeed, I emphasize conviction in the insight and vision.	2026-02-07 15:19:42.630133+00
a9d53de7-5b4e-4d4e-a872-66cbd925c552	331e2675-9fa9-4145-ae8e-159619935619	D1b	talent_gravity	5	When strong candidates hesitate to join, I assume I haven't created enough clarity or trust.	2026-02-07 15:19:42.630133+00
e4b806e3-829a-4dba-b94a-4bd342f4c610	331e2675-9fa9-4145-ae8e-159619935619	F1b	resilience_economics	5	During prolonged stress, I adjust pace early to preserve long-term stamina.	2026-02-07 15:19:42.630133+00
cc0373ef-0b25-431b-87e1-42b446f0a9b6	331e2675-9fa9-4145-ae8e-159619935619	C1a	decision_quality_under_load	5	Under time pressure, I make a call quickly to preserve momentum.	2026-02-07 15:19:42.630133+00
9d1f5dda-edd8-4f39-b0f9-8df3b594c76f	331e2675-9fa9-4145-ae8e-159619935619	B1b	learning_velocity	1	After receiving new customer or market feedback, I adjust behavior quickly, even if it creates short-term inconsistency.	2026-02-07 15:19:42.630133+00
a81b9941-c2fe-4578-86f4-653a97535d0b	331e2675-9fa9-4145-ae8e-159619935619	E2b	delivery_control	2	I prefer execution systems that enforce discipline and accountability.	2026-02-07 15:19:42.630133+00
d7ebba55-bc7e-46fd-a79d-31b2ef9a994c	331e2675-9fa9-4145-ae8e-159619935619	A1a	thesis_integrity	2	When evidence challenges my core assumptions, I defend the original explanation unless the contradiction is overwhelming.	2026-02-07 15:19:42.630133+00
96efc10b-3b3e-43a8-b5c7-fea189428802	331e2675-9fa9-4145-ae8e-159619935619	F2a	resilience_economics	4	After a significant setback, I refocus immediately on the next objective.	2026-02-07 15:19:42.630133+00
363190be-51c9-461e-b830-3525f4da02c3	331e2675-9fa9-4145-ae8e-159619935619	C2a	decision_quality_under_load	1	When several urgent problems compete for attention, I start by solving the fastest or most visible problems first.	2026-02-07 15:19:42.630133+00
81eaf59a-2fdc-4f7e-9321-dace7b4933eb	331e2675-9fa9-4145-ae8e-159619935619	D2b	talent_gravity	4	When someone on my team underperforms, my first instinct is to invest time coaching before deciding on a change.	2026-02-07 15:19:42.630133+00
989ca763-c357-478e-bbab-d1883d23ecd0	331e2675-9fa9-4145-ae8e-159619935619	B2a	learning_velocity	4	When something isn't working, I spend time diagnosing the root cause before acting.	2026-02-07 15:19:42.630133+00
449c87a5-7399-415c-ab9f-6cad963c25fa	331e2675-9fa9-4145-ae8e-159619935619	E1b	delivery_control	5	When deadlines slip, it's usually because the original plan underestimated complexity.	2026-02-07 15:19:42.630133+00
dcb9c04c-b787-4a8a-9ad8-6e494493b95e	331e2675-9fa9-4145-ae8e-159619935619	A_FINAL	thesis_integrity	0	You're involved in developing something with serious real-world impact — for example, a flying vehicle or a life-saving medical treatment.\n\nEarly tests support your explanation for why it works. As trials expand, a growing number of edge cases appear. None are disastrous, but they don't fully fit your original understanding.\n\nMomentum matters, but being wrong would have meaningful consequences.\n\nWhat do you do next?	2026-02-07 15:19:42.630133+00
79880504-9337-4b6f-bb63-082e831f34e0	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q2	thesis_integrity	3	You go to the same café weekly. Today you overhear the barista tell a coworker, "We're supposed to sanitize the milk wand between drinks… but when it's busy, nobody does." You already drank half your latte.\n\nWhat do you do?	2026-02-07 15:19:42.630133+00
55931845-8d86-4234-bb89-e164e207da7f	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q3	thesis_integrity	2	A well-known founder launches a highly ambitious product early. The technology works, but adoption is weak and the product is eventually shut down.\n\nYears later, the founder asks: "What should I have done differently?"\n\nWhich advice best reflects what you would give them?	2026-02-07 15:19:42.630133+00
e1db6493-b373-48e5-a25d-2eb15fc20404	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q4	thesis_integrity	3	You and a cofounder disagree on a core product decision. You believe the data supports your position. Your cofounder believes the data is inconclusive and worries about downstream risk. Both of you are credible. The decision matters.\n\nHow do you proceed?	2026-02-07 15:19:42.630133+00
6c8b609a-3e02-4a38-9d69-1de3f7543912	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q5	thesis_integrity	1	You've publicly committed to a breakthrough product. Early traction exists and press coverage has been positive. New evidence suggests the core assumption may be wrong or premature.\n\nWhat do you do?	2026-02-07 15:19:42.630133+00
b16648b9-6ee3-4346-b0da-fcdae37a9afc	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q6	thesis_integrity	3	A founder you know built a startup that failed after raising meaningful capital. They're starting a new company in the same general space and say: "This time I'll execute better. The idea was right." They ask you what they should do differently before committing fully again.	2026-02-07 15:19:42.630133+00
5a7ae006-8316-478f-9127-2d86fe5c9bf3	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q7	thesis_integrity	2	Your company has a compelling story that resonates with customers and investors. Internally, data is becoming noisier and harder to reconcile with that story — not clearly wrong, but increasingly strained. You're deciding how to handle internal discussions.	2026-02-07 15:19:42.630133+00
c850773d-cae3-424d-8052-96248bbfcce2	331e2675-9fa9-4145-ae8e-159619935619	A_TI_Q8	thesis_integrity	1	You're confident a major shift is coming, but adoption is slow. Evidence suggests you may be directionally right but significantly early. You must decide how to interpret this.	2026-02-07 15:19:42.630133+00
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (id, founder_id, venture_id, overall_score, force_thesis_integrity, force_learning_velocity, force_decision_quality, force_talent_gravity, force_delivery_control, force_resilience_economics, integrity_score, integrity_flags, integrity_checks, started_at, duration_seconds, assessment_version, metadata, created_at, completed_at) FROM stdin;
14ac87ad-1812-4a60-81d5-eb2fc9b57236	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	88	100	100	75	75	75	100	100	[]	{"straightlining": {"passed": true, "straightlinePercentage": 0.5}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 429}, "extremePatterns": {"passed": true, "extremePercentage": 0.5}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-10 19:53:05.019+00	429	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"team_size": "2-5", "age_bracket": "45_49", "prior_exits": "0", "industry_years": "11-20", "previous_exits": "1", "prior_startups": "3_plus", "cofounder_count": "solo", "education_level": "bachelors", "founding_experience": "3+", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-10T19:53:05.019Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [], "integrity_score": 100, "duration_seconds": 429, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.5}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 429}, "extremePatterns": {"passed": true, "extremePercentage": 0.5}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-10 20:00:14.479306+00	2026-01-10 20:00:14.375+00
a4cf1849-8b96-4c06-b59f-3339fd5cb877	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	78	72	88	100	88	75	50	100	[]	{"straightlining": {"passed": true, "straightlinePercentage": 0.35}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 410}, "extremePatterns": {"passed": true, "extremePercentage": 0.6}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-11 00:05:48.865+00	410	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "3_plus", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-11T00:05:48.865Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [], "integrity_score": 100, "duration_seconds": 410, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.35}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 410}, "extremePatterns": {"passed": true, "extremePercentage": 0.6}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-11 00:12:38.736191+00	2026-01-11 00:12:38.576+00
6021e27b-9f91-4fea-a3f1-ca2de28d6d1f	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	56	51	56	63	63	56	50	95	[{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 105, "durationSeconds": 6296.754}, "message": "Assessment took unusually long (105min). May indicate interruptions.", "severity": "low"}]	{"straightlining": {"passed": true, "straightlinePercentage": 0.45}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 6297}, "extremePatterns": {"passed": true, "extremePercentage": 0.19}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-11 11:43:51.91+00	6297	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "3_plus", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-11T11:43:51.910Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 105, "durationSeconds": 6296.754}, "message": "Assessment took unusually long (105min). May indicate interruptions.", "severity": "low"}], "integrity_score": 95, "duration_seconds": 6297, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.45}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 6297}, "extremePatterns": {"passed": true, "extremePercentage": 0.19}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-11 13:28:48.927083+00	2026-01-11 13:28:48.664+00
f903166e-f8ea-4a02-9a43-8241abd44637	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	56	51	56	63	63	56	50	95	[{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 105, "durationSeconds": 6297.019}, "message": "Assessment took unusually long (105min). May indicate interruptions.", "severity": "low"}]	{"straightlining": {"passed": true, "straightlinePercentage": 0.45}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 6297}, "extremePatterns": {"passed": true, "extremePercentage": 0.19}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-11 11:43:51.91+00	6297	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "3_plus", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-11T11:43:51.910Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 105, "durationSeconds": 6297.019}, "message": "Assessment took unusually long (105min). May indicate interruptions.", "severity": "low"}], "integrity_score": 95, "duration_seconds": 6297, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.45}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 6297}, "extremePatterns": {"passed": true, "extremePercentage": 0.19}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-11 13:28:49.044985+00	2026-01-11 13:28:48.929+00
c77750d3-3572-4fe2-b094-4774c7155c12	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	92	52	100	100	100	100	100	70	[{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 146, "durationSeconds": 8767.046}, "message": "Assessment took unusually long (146min). May indicate interruptions.", "severity": "low"}, {"type": "straightlining", "details": {"percentage": 0.71875, "occurrences": 23, "totalQuestions": 32, "mostCommonValue": "5"}, "message": "Straightlining detected: 72% of answers are the same value (5).", "severity": "medium"}]	{"straightlining": {"passed": false, "straightlinePercentage": 0.72}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 8767}, "extremePatterns": {"passed": true, "extremePercentage": 0.72}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-11 13:51:54.546+00	8767	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "3_plus", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-11T13:51:54.546Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [{"type": "time_outlier", "details": {"expectedMax": 1800, "durationMinutes": 146, "durationSeconds": 8767.046}, "message": "Assessment took unusually long (146min). May indicate interruptions.", "severity": "low"}, {"type": "straightlining", "details": {"percentage": 0.71875, "occurrences": 23, "totalQuestions": 32, "mostCommonValue": "5"}, "message": "Straightlining detected: 72% of answers are the same value (5).", "severity": "medium"}], "integrity_score": 70, "duration_seconds": 8767, "integrity_checks": {"straightlining": {"passed": false, "straightlinePercentage": 0.72}, "timeToComplete": {"passed": false, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 8767}, "extremePatterns": {"passed": true, "extremePercentage": 0.72}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-11 16:18:01.766925+00	2026-01-11 16:18:01.592+00
4c788d64-cd86-4a90-aa6f-82edc6bb10b2	dffd3e37-431b-4e25-902e-b1343f2a129a	\N	53	67	56	31	88	63	25	100	[]	{"straightlining": {"passed": true, "straightlinePercentage": 0.25}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 1491}, "extremePatterns": {"passed": true, "extremePercentage": 0.34}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-01-12 11:57:26.918+00	1491	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "3_plus", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-01-12T11:57:26.918Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [], "integrity_score": 100, "duration_seconds": 1491, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.25}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 1491}, "extremePatterns": {"passed": true, "extremePercentage": 0.34}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-01-12 12:22:18.458569+00	2026-01-12 12:22:18.31+00
331e2675-9fa9-4145-ae8e-159619935619	793d7b86-2a26-4c08-be19-012749761856	\N	52	53	50	44	69	56	44	100	[]	{"straightlining": {"passed": true, "straightlinePercentage": 0.28}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 490}, "extremePatterns": {"passed": true, "extremePercentage": 0.53}, "inconsistentPairs": {"passed": true, "violations": 0}}	2026-02-07 15:11:32.416+00	490	v2.1	{"narrative": {"ageContext": "Seasoned founder: Deep expertise and network. Continue challenging assumptions and ensure agility in execution despite accumulated experience.", "cofounderContext": "Solo founder: High autonomy and speed, but risk of burnout and blind spots. Critical to build strong advisory networks and maintain personal resilience.", "priorExitsContext": "Experienced founder without exits: Pattern recognition from prior attempts. Apply lessons learned while avoiding over-correction from past failures.", "industryExperienceContext": "Deep industry expertise: Strong pattern recognition and credibility. Guard against over-indexing on past experience—remain open to disruptive approaches."}, "demographics": {"age_bracket": "45_49", "prior_exits": "0", "prior_startups": "2", "cofounder_count": "solo", "industry_experience": "11_plus"}, "weight_profile": {"branch": "solo", "version": "v2.1", "forceWeights": {"talent_gravity": 0.11650485436893203, "delivery_control": 0.1941747572815534, "thesis_integrity": 0.17475728155339804, "learning_velocity": 0.1650485436893204, "resilience_economics": 0.17475728155339804, "decision_quality_under_load": 0.17475728155339804}, "deltasApplied": {"industry_experience:thesis_integrity": 0.02, "industry_experience:learning_velocity": 0.01}, "normalizedSum": 1}, "integrity_snapshot": {"version": "v2.1", "started_at": "2026-02-07T15:11:32.416Z", "thresholds": {"maxDuration": 1800, "minDuration": 60, "straightlineThreshold": 0.7, "extremePatternThreshold": 0.8}, "integrity_flags": [], "integrity_score": 100, "duration_seconds": 490, "integrity_checks": {"straightlining": {"passed": true, "straightlinePercentage": 0.28}, "timeToComplete": {"passed": true, "expectedRange": {"max": 1800, "min": 60}, "durationSeconds": 490}, "extremePatterns": {"passed": true, "extremePercentage": 0.53}, "inconsistentPairs": {"passed": true, "violations": 0}}}}	2026-02-07 15:19:42.402875+00	2026-02-07 15:19:42.25+00
\.


--
-- Data for Name: founders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.founders (id, email, name, role, auth_user_id, created_at, updated_at) FROM stdin;
dffd3e37-431b-4e25-902e-b1343f2a129a	brett@plume.ca	Brett Bilon	founder	e327e7ac-a3ed-4972-8dc4-2fbf33233557	2026-01-10 16:21:26.202256+00	2026-01-10 16:21:26.202256+00
793d7b86-2a26-4c08-be19-012749761856	brettbilon@gmail.com	Brett Bilon	founder	e73889a4-8bfa-412b-81e2-ec8d3b4c9edc	2026-02-07 15:10:50.603732+00	2026-02-07 15:10:50.603732+00
\.


--
-- Data for Name: test_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_reports (id, created_at, overall_score, dimension_scores, responses, test_taker_email, test_taker_name, user_name, user_email) FROM stdin;
621fed1c-6991-45c2-bfd4-b074741ca382	2026-01-09 23:54:17.222983+00	100	{"Openness": 100, "Conviction": 100, "Energy & Drive": 100, "Conscientiousness": 100, "Emotional Stability": 100, "Skepticism & Adaptability": 100}	{"A1": {"type": "binary", "value": 1, "dimension": "Openness"}, "A2": {"type": "binary", "value": 1, "dimension": "Openness"}, "A3": {"type": "binary", "value": 1, "dimension": "Openness"}, "A4": {"type": "binary", "value": 1, "dimension": "Openness"}, "A5": {"type": "likert", "value": 5, "dimension": "Openness"}, "C1": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C2": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C3": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C4": {"type": "likert", "value": 5, "dimension": "Energy & Drive"}, "E1": {"type": "binary", "value": 1, "dimension": "Emotional Stability"}, "E2": {"type": "binary", "value": 1, "dimension": "Emotional Stability"}, "E3": {"type": "likert", "value": 5, "dimension": "Emotional Stability"}, "F1": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "F2": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "F3": {"type": "likert", "value": 5, "dimension": "Skepticism & Adaptability"}, "F4": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "BCONS1": {"type": "binary", "value": 1, "dimension": "Conscientiousness"}, "BCONS2": {"type": "binary", "value": 1, "dimension": "Conscientiousness"}, "BCONS3": {"type": "likert", "value": 5, "dimension": "Conscientiousness"}, "DCONV1": {"type": "binary", "value": 1, "dimension": "Conviction"}, "DCONV2": {"type": "binary", "value": 1, "dimension": "Conviction"}, "DCONV3": {"type": "likert", "value": 5, "dimension": "Conviction"}}	\N	\N	Brett Bilon	brett@execom.ca
f1e46d34-8602-4edb-9ca7-3ae9102072bc	2026-01-09 23:58:46.985145+00	100	{"Openness": 100, "Conviction": 100, "Energy & Drive": 100, "Conscientiousness": 100, "Emotional Stability": 100, "Skepticism & Adaptability": 100}	{"A1": {"type": "binary", "value": 1, "dimension": "Openness"}, "A2": {"type": "binary", "value": 1, "dimension": "Openness"}, "A3": {"type": "binary", "value": 1, "dimension": "Openness"}, "A4": {"type": "binary", "value": 1, "dimension": "Openness"}, "A5": {"type": "likert", "value": 5, "dimension": "Openness"}, "C1": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C2": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C3": {"type": "binary", "value": 1, "dimension": "Energy & Drive"}, "C4": {"type": "likert", "value": 5, "dimension": "Energy & Drive"}, "E1": {"type": "binary", "value": 1, "dimension": "Emotional Stability"}, "E2": {"type": "binary", "value": 1, "dimension": "Emotional Stability"}, "E3": {"type": "likert", "value": 5, "dimension": "Emotional Stability"}, "F1": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "F2": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "F3": {"type": "likert", "value": 5, "dimension": "Skepticism & Adaptability"}, "F4": {"type": "binary", "value": 1, "dimension": "Skepticism & Adaptability"}, "BCONS1": {"type": "binary", "value": 1, "dimension": "Conscientiousness"}, "BCONS2": {"type": "binary", "value": 1, "dimension": "Conscientiousness"}, "BCONS3": {"type": "likert", "value": 5, "dimension": "Conscientiousness"}, "DCONV1": {"type": "binary", "value": 1, "dimension": "Conviction"}, "DCONV2": {"type": "binary", "value": 1, "dimension": "Conviction"}, "DCONV3": {"type": "likert", "value": 5, "dimension": "Conviction"}}	\N	\N	Brett Test	brett@plume.ca
\.


--
-- Data for Name: ventures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventures (id, founder_id, name, description, stage, outcome, founded_date, outcome_date, outcome_notes, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-01-09 19:49:16.362727
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-01-09 19:49:16.369529
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2026-01-09 19:49:16.37481
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-01-09 19:49:16.394378
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-01-09 19:49:16.40259
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-01-09 19:49:16.406431
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2026-01-09 19:49:16.410797
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-01-09 19:49:16.415251
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-01-09 19:49:16.41881
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2026-01-09 19:49:16.422523
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2026-01-09 19:49:16.426505
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-01-09 19:49:16.431009
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-01-09 19:49:16.435223
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-01-09 19:49:16.439911
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-01-09 19:49:16.4439
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-01-09 19:49:16.460502
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-01-09 19:49:16.464249
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-01-09 19:49:16.467917
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-01-09 19:49:16.471601
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-01-09 19:49:16.475983
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-01-09 19:49:16.479676
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-01-09 19:49:16.484873
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-01-09 19:49:16.496509
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-01-09 19:49:16.505249
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-01-09 19:49:16.50904
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-01-09 19:49:16.512897
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2026-01-09 19:49:16.516756
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2026-01-09 19:49:16.526723
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2026-01-09 19:49:16.535104
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2026-01-09 19:49:16.539363
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2026-01-09 19:49:16.543188
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2026-01-09 19:49:16.549598
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2026-01-09 19:49:16.556031
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2026-01-09 19:49:16.562482
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2026-01-09 19:49:16.564221
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2026-01-09 19:49:16.569118
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2026-01-09 19:49:16.572733
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-01-09 19:49:16.578442
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2026-01-09 19:49:16.582665
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2026-01-09 19:49:16.590095
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2026-01-09 19:49:16.594274
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2026-01-09 19:49:16.601127
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2026-01-09 19:49:16.605981
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2026-01-09 19:49:16.612187
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-01-09 19:49:16.616075
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-01-09 19:49:16.620633
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-01-09 19:49:16.64211
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-01-09 19:49:16.646171
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2026-01-09 19:49:16.649786
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-09 19:49:16.663909
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 18, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: assessment_responses assessment_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: founders founders_auth_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founders
    ADD CONSTRAINT founders_auth_user_id_key UNIQUE (auth_user_id);


--
-- Name: founders founders_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founders
    ADD CONSTRAINT founders_email_key UNIQUE (email);


--
-- Name: founders founders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founders
    ADD CONSTRAINT founders_pkey PRIMARY KEY (id);


--
-- Name: test_reports test_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_reports
    ADD CONSTRAINT test_reports_pkey PRIMARY KEY (id);


--
-- Name: ventures ventures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventures
    ADD CONSTRAINT ventures_pkey PRIMARY KEY (id);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_assessment_responses_assessment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessment_responses_assessment_id ON public.assessment_responses USING btree (assessment_id);


--
-- Name: idx_assessment_responses_force; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessment_responses_force ON public.assessment_responses USING btree (force);


--
-- Name: idx_assessments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_created_at ON public.assessments USING btree (created_at DESC);


--
-- Name: idx_assessments_founder_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_founder_created ON public.assessments USING btree (founder_id, created_at DESC);


--
-- Name: idx_assessments_founder_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_founder_id ON public.assessments USING btree (founder_id);


--
-- Name: idx_assessments_integrity_flags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_integrity_flags ON public.assessments USING gin (integrity_flags);


--
-- Name: idx_assessments_integrity_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_integrity_score ON public.assessments USING btree (integrity_score);


--
-- Name: idx_assessments_venture_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessments_venture_id ON public.assessments USING btree (venture_id);


--
-- Name: idx_founders_auth_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_founders_auth_user_id ON public.founders USING btree (auth_user_id);


--
-- Name: idx_founders_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_founders_email ON public.founders USING btree (email);


--
-- Name: idx_founders_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_founders_role ON public.founders USING btree (role);


--
-- Name: idx_test_reports_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_test_reports_email ON public.test_reports USING btree (user_email);


--
-- Name: idx_ventures_founder_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventures_founder_id ON public.ventures USING btree (founder_id);


--
-- Name: idx_ventures_founder_outcome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventures_founder_outcome ON public.ventures USING btree (founder_id, outcome);


--
-- Name: idx_ventures_outcome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventures_outcome ON public.ventures USING btree (outcome);


--
-- Name: idx_ventures_stage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventures_stage ON public.ventures USING btree (stage);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: founders update_founders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON public.founders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ventures update_ventures_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_ventures_updated_at BEFORE UPDATE ON public.ventures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: assessment_responses assessment_responses_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_responses
    ADD CONSTRAINT assessment_responses_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- Name: assessments assessments_founder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_founder_id_fkey FOREIGN KEY (founder_id) REFERENCES public.founders(id) ON DELETE CASCADE;


--
-- Name: assessments assessments_venture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_venture_id_fkey FOREIGN KEY (venture_id) REFERENCES public.ventures(id) ON DELETE SET NULL;


--
-- Name: ventures ventures_founder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventures
    ADD CONSTRAINT ventures_founder_id_fkey FOREIGN KEY (founder_id) REFERENCES public.founders(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: test_reports Allow public inserts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public inserts" ON public.test_reports FOR INSERT WITH CHECK (true);


--
-- Name: test_reports Allow public reads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public reads" ON public.test_reports FOR SELECT USING (true);


--
-- Name: assessment_responses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: assessments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

--
-- Name: assessments assessments_delete_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_delete_admin ON public.assessments FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessments assessments_insert_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_insert_admin ON public.assessments FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessments assessments_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_insert_own ON public.assessments FOR INSERT WITH CHECK ((founder_id IN ( SELECT founders.id
   FROM public.founders
  WHERE (founders.auth_user_id = auth.uid()))));


--
-- Name: assessments assessments_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_select_admin ON public.assessments FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessments assessments_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_select_own ON public.assessments FOR SELECT USING ((founder_id IN ( SELECT founders.id
   FROM public.founders
  WHERE (founders.auth_user_id = auth.uid()))));


--
-- Name: assessments assessments_update_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY assessments_update_admin ON public.assessments FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: founders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

--
-- Name: founders founders_insert_from_auth; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY founders_insert_from_auth ON public.founders FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: founders founders_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY founders_select_own ON public.founders FOR SELECT USING ((auth.uid() = auth_user_id));


--
-- Name: founders founders_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY founders_update_own ON public.founders FOR UPDATE USING ((auth.uid() = auth_user_id));


--
-- Name: assessment_responses responses_delete_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_delete_admin ON public.assessment_responses FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessment_responses responses_insert_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_insert_admin ON public.assessment_responses FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessment_responses responses_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_insert_own ON public.assessment_responses FOR INSERT WITH CHECK ((assessment_id IN ( SELECT assessments.id
   FROM public.assessments
  WHERE (assessments.founder_id IN ( SELECT founders.id
           FROM public.founders
          WHERE (founders.auth_user_id = auth.uid()))))));


--
-- Name: assessment_responses responses_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_select_admin ON public.assessment_responses FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: assessment_responses responses_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_select_own ON public.assessment_responses FOR SELECT USING ((assessment_id IN ( SELECT assessments.id
   FROM public.assessments
  WHERE (assessments.founder_id IN ( SELECT founders.id
           FROM public.founders
          WHERE (founders.auth_user_id = auth.uid()))))));


--
-- Name: assessment_responses responses_update_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY responses_update_admin ON public.assessment_responses FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: test_reports; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.test_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: ventures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;

--
-- Name: ventures ventures_delete_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_delete_admin ON public.ventures FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: ventures ventures_insert_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_insert_admin ON public.ventures FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: ventures ventures_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_insert_own ON public.ventures FOR INSERT WITH CHECK ((founder_id IN ( SELECT founders.id
   FROM public.founders
  WHERE (founders.auth_user_id = auth.uid()))));


--
-- Name: ventures ventures_select_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_select_admin ON public.ventures FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: ventures ventures_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_select_own ON public.ventures FOR SELECT USING ((founder_id IN ( SELECT founders.id
   FROM public.founders
  WHERE (founders.auth_user_id = auth.uid()))));


--
-- Name: ventures ventures_update_admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_update_admin ON public.ventures FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.founders
  WHERE ((founders.auth_user_id = auth.uid()) AND (founders.role = 'admin'::public.user_role)))));


--
-- Name: ventures ventures_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY ventures_update_own ON public.ventures FOR UPDATE USING ((founder_id IN ( SELECT founders.id
   FROM public.founders
  WHERE (founders.auth_user_id = auth.uid()))));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE assessment_responses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.assessment_responses TO anon;
GRANT ALL ON TABLE public.assessment_responses TO authenticated;
GRANT ALL ON TABLE public.assessment_responses TO service_role;


--
-- Name: TABLE assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.assessments TO anon;
GRANT ALL ON TABLE public.assessments TO authenticated;
GRANT ALL ON TABLE public.assessments TO service_role;


--
-- Name: TABLE ventures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ventures TO anon;
GRANT ALL ON TABLE public.ventures TO authenticated;
GRANT ALL ON TABLE public.ventures TO service_role;


--
-- Name: TABLE cohort_analysis; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cohort_analysis TO anon;
GRANT ALL ON TABLE public.cohort_analysis TO authenticated;
GRANT ALL ON TABLE public.cohort_analysis TO service_role;


--
-- Name: TABLE founders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.founders TO anon;
GRANT ALL ON TABLE public.founders TO authenticated;
GRANT ALL ON TABLE public.founders TO service_role;


--
-- Name: TABLE founder_assessment_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.founder_assessment_history TO anon;
GRANT ALL ON TABLE public.founder_assessment_history TO authenticated;
GRANT ALL ON TABLE public.founder_assessment_history TO service_role;


--
-- Name: TABLE test_reports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.test_reports TO anon;
GRANT ALL ON TABLE public.test_reports TO authenticated;
GRANT ALL ON TABLE public.test_reports TO service_role;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict jkmuXRt61JKkvz2vzPrCsimaqA5VcaPGO8sacjAxewMRuxqNn7YuPgwZ6MXmnXp

