begin;

create table public.commercial_opportunities (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    business_name text,
    contact_name text,
    phone text,
    email text,

    origin text not null default 'manual',
    source_detail text,

    status text not null default 'new',
    interests text[] not null default '{}'::text[],
    internal_notes text,

    last_contact_at timestamptz,
    next_followup_at timestamptz,

    demo_status text not null default 'not_needed',
    demo_url text,
    demo_sent_at timestamptz,

    constraint commercial_opportunities_business_name_length_check
        check (business_name is null or char_length(business_name) <= 160),
    constraint commercial_opportunities_contact_name_length_check
        check (contact_name is null or char_length(contact_name) <= 160),
    constraint commercial_opportunities_phone_length_check
        check (phone is null or char_length(phone) <= 50),
    constraint commercial_opportunities_email_length_check
        check (email is null or char_length(email) <= 254),
    constraint commercial_opportunities_source_detail_length_check
        check (source_detail is null or char_length(source_detail) <= 300),
    constraint commercial_opportunities_internal_notes_length_check
        check (internal_notes is null or char_length(internal_notes) <= 4000),
    constraint commercial_opportunities_demo_url_length_check
        check (demo_url is null or char_length(demo_url) <= 1000),
    constraint commercial_opportunities_status_check
        check (status in ('new', 'reviewing', 'proposal_sent', 'accepted', 'declined', 'in_project')),
    constraint commercial_opportunities_demo_status_check
        check (demo_status in ('not_needed', 'pending', 'ready', 'sent')),
    constraint commercial_opportunities_origin_check
        check (origin in ('visit', 'referral', 'instagram', 'whatsapp', 'call', 'event', 'manual', 'other')),
    constraint commercial_opportunities_interests_check
        check (
            (array_ndims(interests) is null or array_ndims(interests) = 1)
            and array_position(interests, null) is null
            and interests <@ array['web', 'local_presence', 'systems', 'automation', 'other']::text[]
        ),
    constraint commercial_opportunities_demo_url_scheme_check
        check (demo_url is null or demo_url ~* '^https?://')
);

create function nodo_private.set_commercial_opportunities_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
    new.demo_url := nullif(btrim(new.demo_url), '');
    new.updated_at := now();
    return new;
end;
$$;

create trigger set_commercial_opportunities_updated_at
before insert or update on public.commercial_opportunities
for each row
execute function nodo_private.set_commercial_opportunities_updated_at();

create index commercial_opportunities_status_idx
    on public.commercial_opportunities (status);

create index commercial_opportunities_next_followup_at_idx
    on public.commercial_opportunities (next_followup_at)
    where next_followup_at is not null;

create index commercial_opportunities_created_at_idx
    on public.commercial_opportunities (created_at desc);

alter table public.commercial_opportunities enable row level security;

revoke all on table public.commercial_opportunities from public;
revoke all on table public.commercial_opportunities from anon;
revoke all on table public.commercial_opportunities from authenticated;

grant select, insert, update on table public.commercial_opportunities to authenticated;

create policy "NODO admins can read commercial opportunities"
on public.commercial_opportunities
for select
to authenticated
using ((select nodo_private.is_nodo_admin()));

create policy "NODO admins can create commercial opportunities"
on public.commercial_opportunities
for insert
to authenticated
with check ((select nodo_private.is_nodo_admin()));

create policy "NODO admins can update commercial opportunities"
on public.commercial_opportunities
for update
to authenticated
using ((select nodo_private.is_nodo_admin()))
with check ((select nodo_private.is_nodo_admin()));

commit;
