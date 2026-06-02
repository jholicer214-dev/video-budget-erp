# 영상 제작 예산 ERP

이 프로젝트는 다시 단일 HTML 파일 방식으로 정리되었습니다.

## 실행 방법

`budget-calculator.html` 파일을 더블클릭하면 바로 실행됩니다.

별도 서버, 로그인, 비밀번호, npm, Next.js, Vercel 배포가 필요하지 않습니다.

Supabase 동기화를 사용하려면 인터넷 연결과 Supabase 테이블 설정이 필요합니다.

## 공유 방법

상대방에게 아래 파일 하나만 전달하면 됩니다.

```text
budget-calculator.html
```

받는 사람은 파일을 더블클릭해서 브라우저에서 바로 사용할 수 있습니다.

관리자는 기본 주소로 접속합니다.

```text
budget-calculator.html
```

특정 프로젝트를 링크로 공유하려면 주소 뒤에 `?project=프로젝트ID`가 붙은 링크를 사용합니다. 앱에서 프로젝트를 생성하거나 불러오면 주소가 자동으로 해당 프로젝트 링크로 바뀝니다.

```text
budget-calculator.html?project=abc123
```

뷰어는 주소 뒤에 `mode=view`를 함께 붙여 접속합니다.

```text
budget-calculator.html?project=abc123&mode=view
```

## 유지되는 기능

- 예산 항목 입력/수정/삭제
- 기존 계산 로직
- 총예산, 예상 마진, 마진율 계산
- localStorage 자동 저장
- Supabase 실시간 동기화
- 프로젝트 URL 공유
- 관리자/뷰어 모드
- 프로젝트 저장/불러오기/삭제
- 새 프로젝트 생성/프로젝트 이름 변경
- 프로젝트 검색/최근 수정순 정렬
- 저장 상태 표시
- Supabase 연결 테스트
- 현재 프로젝트 JSON 백업
- 프로젝트 복제/아카이브
- 최근 수정 로그
- JSON 내보내기/가져오기
- Excel 내보내기
- 다크모드

## Supabase 설정

현재 HTML에는 아래 Supabase 프로젝트가 연결되어 있습니다.

```text
NEXT_PUBLIC_SUPABASE_URL=https://zxmzzrcgulawsffaobaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_q2HCDDvgTgumPazVrN0Acw_RQ3IYWPx
```

Supabase 대시보드의 SQL Editor에서 아래 SQL을 한 번 실행하면 됩니다.

이전에 테스트용 `budget_items` 단일 테이블을 이미 만든 적이 있다면, 실제 데이터가 없는지 확인한 뒤 기존 테이블을 삭제하고 아래 SQL을 실행하세요. 기존 테이블 구조가 다르면 새 앱이 저장에 실패할 수 있습니다.

```sql
create table if not exists public.projects (
    id text primary key,
    name text not null default '',
    contract_supply_amount numeric not null default 0,
    dark_mode boolean not null default false,
    view_mode text not null default 'input',
    archived boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.budget_items (
    id text primary key,
    project_id text not null references public.projects(id) on delete cascade,
    category text not null default '',
    sub_category text not null default '',
    payment_type text not null default '',
    staff_name text not null default '',
    unit_price numeric not null default 0,
    shooting_days numeric not null default 0,
    rental_days numeric not null default 0,
    people_count numeric not null default 0,
    overtime_hours numeric not null default 0,
    turnkey boolean not null default false,
    additional_amount numeric not null default 0,
    base_amount numeric not null default 0,
    overtime_amount numeric not null default 0,
    supply_amount numeric not null default 0,
    vat numeric not null default 0,
    withholding numeric not null default 0,
    final_amount numeric not null default 0,
    display_order numeric not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.project_history (
    id text primary key,
    project_id text,
    project_name text not null default '',
    actor_name text not null default '',
    action text not null default '',
    created_at timestamptz not null default now()
);

create index if not exists budget_items_project_id_idx
on public.budget_items(project_id);

create index if not exists project_history_project_id_idx
on public.project_history(project_id);

alter table public.projects
add column if not exists archived boolean not null default false;

alter table public.budget_items
add column if not exists display_order numeric not null default 0;

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
        and table_name = 'budget_items'
        and column_name = 'sort_order'
    ) then
        execute 'update public.budget_items set display_order = sort_order where display_order = 0';
    end if;
end $$;

alter table public.projects enable row level security;
alter table public.budget_items enable row level security;
alter table public.project_history enable row level security;
alter table public.projects replica identity full;
alter table public.budget_items replica identity full;
alter table public.project_history replica identity full;

drop policy if exists "projects_public_select" on public.projects;
drop policy if exists "projects_public_insert" on public.projects;
drop policy if exists "projects_public_update" on public.projects;
drop policy if exists "projects_public_delete" on public.projects;
drop policy if exists "budget_items_public_select" on public.budget_items;
drop policy if exists "budget_items_public_insert" on public.budget_items;
drop policy if exists "budget_items_public_update" on public.budget_items;
drop policy if exists "budget_items_public_delete" on public.budget_items;
drop policy if exists "project_history_public_select" on public.project_history;
drop policy if exists "project_history_public_insert" on public.project_history;

create policy "projects_public_select"
on public.projects
for select
using (true);

create policy "projects_public_insert"
on public.projects
for insert
with check (true);

create policy "projects_public_update"
on public.projects
for update
using (true)
with check (true);

create policy "projects_public_delete"
on public.projects
for delete
using (true);

create policy "budget_items_public_select"
on public.budget_items
for select
using (true);

create policy "budget_items_public_insert"
on public.budget_items
for insert
with check (true);

create policy "budget_items_public_update"
on public.budget_items
for update
using (true)
with check (true);

create policy "budget_items_public_delete"
on public.budget_items
for delete
using (true);

create policy "project_history_public_select"
on public.project_history
for select
using (true);

create policy "project_history_public_insert"
on public.project_history
for insert
with check (true);
```

실시간 반영을 위해 Supabase 대시보드에서 `Database > Replication` 메뉴로 이동한 뒤 `projects`, `budget_items`, `project_history` 테이블의 Realtime을 켜주세요.

이 ERP는 프로젝트 기본 정보는 `projects`에 저장하고, 예산 항목은 `budget_items`에 row 단위로 저장합니다. 예산 항목 순서는 `display_order` 컬럼에 저장합니다. 여러 사용자가 같은 `project` 링크를 열면 한쪽에서 수정한 예산 항목과 총예산이 다른 화면에도 실시간으로 반영됩니다.

동시에 수정이 들어오면 `updated_at` 기준으로 더 최근 변경을 화면에 반영합니다.

상단 저장 상태는 아래처럼 표시됩니다.

- `저장 중...`
- `저장 완료`
- `연결 끊김 - localStorage 임시 저장`

Supabase 연결에 실패해도 현재 브라우저의 localStorage에는 자동으로 임시 저장됩니다. 연결이 복구되면 프로젝트 저장 또는 현재 데이터 Supabase 업로드 버튼으로 다시 올릴 수 있습니다.

수정 로그는 최소 버전으로 `누가`, `언제`, `어떤 프로젝트를 수정했는지`, `무엇을 했는지`를 저장합니다. 별도 로그인 구조가 없으므로 최초 기록 시 입력한 사용자 이름을 해당 브라우저의 localStorage에 저장해 사용합니다.

주의: 현재 구조는 링크 공유용 공개 ERP입니다. HTML에 들어가는 Supabase anon key는 브라우저 공개 키이며, 위 정책은 링크를 가진 사용자가 데이터를 읽고 쓸 수 있게 허용합니다. 강한 권한 분리가 필요하면 Supabase Auth 또는 별도 로그인 구조가 필요합니다.

## 더 이상 사용하지 않는 파일/구조

아래 구조는 로그인/비밀번호/Vercel 배포 실험용으로 추가했던 것이며, 현재 단일 HTML 방식에서는 사용하지 않습니다.

- `pages/`
- `lib/`
- `package.json`
- `package-lock.json`
- `next.config.js`
- `.env.local`
- `node_modules/`
- `.next/`
- `next-build/`

현재 폴더에서는 위 항목들을 제거했습니다.

## 데이터 저장 안내

현재 데이터는 Supabase에 우선 저장되고, localStorage에도 보조 저장됩니다.

Supabase 연결이 되어 있으면 다른 컴퓨터나 다른 브라우저에서도 같은 예산표를 볼 수 있습니다.

백업이나 별도 전달이 필요할 때는 화면 상단의 `JSON 내보내기`와 `JSON 가져오기`를 사용하세요.
